import { Inject, Logger } from "@nestjs/common";
import { UserRepository } from "src/repository/user.repository";
import { EmailService } from "./mailer.service";
import { UserUpdateOptions } from "src/repository/user_updateoptions";
import { UserFindOptions } from "src/repository/user_findoptions";
import { UserCreateOptions } from "src/repository/user_createoptions";
import RedisService from "./redis.service";
import { CouponService } from "./coupon.service";
import { UserDto } from "src/dto/user.dto";
import { UserEntity } from "src/entity/user.entity";
import { AuthService } from "./auth.service";
import { MailTemplate } from "src/types/mail_template.types";
import { CertificationMail } from "src/types/create_mail.types";
import { ERROR, TryCatch } from "src/common/form/response.form";
import { UserLoginOptions } from "src/repository/user_loginoptions";

export class UserService {
    constructor(
        @Inject("UserRepository")
        private readonly userRepository: UserRepository,
        private readonly mailService: EmailService,
        private readonly redisService: RedisService,
        private readonly couponSerive: CouponService,
        private readonly authService: AuthService,
    ){
        this.initialized()
    }

    async initialized() : Promise<void> {
        const users = await this.userRepository.get()
        await this.redisService.set("users", users, UserService.name)
        .then(_=> Logger.log("유저 캐시 동기화", UserService.name))
    }

    async getUsers() : Promise<UserDto[]> {
        const caches = await this.redisService.get<UserEntity[]>("users", UserService.name)
        if(caches) return caches.map(u => UserDto.fromEntity(u))

        const entities = await this.userRepository.get()
        return entities.map(u => UserDto.fromEntity(u))
    }

    async getUserBy(args: UserFindOptions) :
     Promise<TryCatch<
    | UserDto
    | null
    | undefined
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerCacheError
    | typeof ERROR.ServerDatabaseError
    >> {
        try{
            const caches = await this.redisService.get<UserEntity[]>("users", UserService.name)
            if(caches) {
                const cache = caches.find(u => u.email === args.email)
                if(cache) return {
                    data: UserDto.fromEntity(cache),
                    statuscode: 200,
                }
            }
            
            const entity = await this.userRepository.getBy(args)
            if(entity) return {
                data: UserDto.fromEntity(entity),
                statuscode: 200,
            }
            return ERROR.ServerDatabaseError
        } catch(e) { return e }

    }

    async login(args: UserLoginOptions) : Promise<TryCatch<
    { user: UserDto, accessToken: string },
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerCacheError
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.NonAuthoritativeInformation
    | typeof ERROR.NotFoundData
    >> {
        try{
            const caches = await this.redisService.get<UserEntity[]>("users", UserService.name)
            let findUser : UserEntity | undefined | null
            if(caches) {
                findUser = caches.find(u => u.email === args.email)
                if(!findUser) return ERROR.NotFoundData
                const result = await this.authService.verifyPass(findUser, args.password)
                if(!result) return ERROR.NonAuthoritativeInformation

                const { accessToken } = await this.authService.publishToken({ email: findUser.email })
                return {
                    data: { user: UserDto.fromEntity(findUser), accessToken },
                    statuscode: 200,
                }
            }
            findUser = await this.userRepository.getBy({ email: args.email })
            if(!findUser) return ERROR.NotFoundData
            const result = await this.authService.verifyPass(findUser, args.password)
            if(!result) return ERROR.NonAuthoritativeInformation
            
            const { accessToken } = await this.authService.publishToken({ email: findUser.email })
            return {
                data: { user: UserDto.fromEntity(findUser), accessToken },
                statuscode: 200,
            }
        } catch(e) { return e }
    }

    async getUserEntityBy(args: UserFindOptions) : Promise<UserEntity | undefined | null> {
        const caches = await this.redisService.get<UserEntity[]>("users", UserService.name)
        if(caches) {
            const cache = caches.find(u => u.email === args.email)
            if(cache) return cache
        }
        
        const entity = await this.userRepository.getBy(args)
        if(entity) return entity
        
        return entity
    }

    async createRequest(data: UserCreateOptions) : Promise<TryCatch<
    boolean
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerCacheError
    >> {
        try{
            const secret = this.authService.generateRandStr(6)
            const template : MailTemplate = {
                to: data.email!,
                title: "MocatMall 회원가입 메일",
                secret,
            }
            
            await this.mailService.sendMail(template)
            .catch(err => ERROR.FailedSendMail)
            const mailData : CertificationMail = {
                secret,
                email: data.email!,
                password: data.password!,
                address: data.address!,
                name: data.name!,
            }

            await this.redisService.set(secret, mailData, UserService.name, (5 * 60))
            return {
                data: true,
                statuscode: 201,
            }
        } catch(e) { return e }
    }

    async createUser(secret: string, args: UserFindOptions) : Promise<TryCatch<
    boolean
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerCacheError
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.NotFoundData
    >> {
        try{
            let mailCache = await this.redisService.get<CertificationMail>(secret, UserService.name)
            if(mailCache) {
                const { salt, hash: encryptPass } = this.authService.encryptionPass(mailCache.password)
                const userEntity = await this.userRepository.create({
                    email: mailCache.email,
                    password: encryptPass,
                    address: mailCache.address,
                    name: mailCache.name,
                }, salt)

                const caches = await this.redisService.get<UserEntity[]>("users", UserService.name) ?? []
                caches.push(userEntity)
                await this.redisService.set(
                    "users", 
                    caches, 
                    UserService.name,
                )
                await this.redisService.delete(secret, UserService.name)

                return {
                    data: true,
                    statuscode: 201,
                }
            } else return ERROR.NotFoundData
        } catch(e) { return e }
    }

    async deleteUser(args: UserFindOptions) : Promise<TryCatch<
    boolean
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerCacheError
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.NotFoundData
    >> {
        try {
            let caches = await this.redisService.get<UserEntity[]>("users", UserService.name) ?? []
            if(caches.length > 0) {
                caches = caches.filter(u => u.email !== args.email)
                await this.redisService.set("users", caches, UserService.name)
            }
            await this.userRepository.deleteBy(args)
            return {
                data: true,
                statuscode: 201,
            }
        } catch(e) { return e }
    }

    async updateUser(data: UserUpdateOptions, args: UserFindOptions) : Promise<TryCatch<
    boolean
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerCacheError
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.NotFoundData
    >> {
        try {
            const user = await this.userRepository.updateBy(data, args)
            let caches = await this.redisService.get<UserEntity[]>("users", UserService.name) ?? []
            if(caches.length > 0) {
                caches = caches.filter(u => u.email !== args.email)
            }
            caches.push(user)
            
            await this.redisService.set("users", caches, UserService.name)
            return {
                data: true,
                statuscode: 201,
            }
        } catch(e) { return e }
    }

    async connectCoupon(coupon: string, args: UserFindOptions) : Promise<TryCatch<
    boolean
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerCacheError
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.NotFoundData
    >> {
        try{
            const isExisting = await this.couponSerive.getCouponBy({couponnumber: coupon})
            if(isExisting) {
                let caches = await this.redisService.get<UserEntity[]>("users", UserService.name)
                coupon += `:${isExisting.salePrice}:${isExisting.validAt.toString()}` 

                let userEntity : UserEntity | undefined | null
                if(caches) {
                    userEntity = caches.find(u => u.email === args.email)
                    if(userEntity && userEntity.coupons.includes(coupon)) ERROR.NotFoundData
                } else {
                    userEntity = await this.userRepository.getBy({ email: args.email })
                    if(userEntity && userEntity.coupons.includes(coupon)) ERROR.NotFoundData
                }

                const user = await this.userRepository.connectCoupon(coupon, args)
                if(caches) {
                    caches = caches.filter(u => u.email !== args.email)
                    caches.push(user)
                    await this.redisService.set("users", caches, UserService.name)
                }
                return {
                    data: true,
                    statuscode: 201,
                }
            } else return ERROR.NotFoundData
        } catch(e) { return e }
    }
}