import { Inject } from "@nestjs/common";
import { UserRepository } from "src/repository/user.repository";
import { EmailService } from "./mailer.service";
import { UserUpdateOptions } from "src/repository/user_updateoptions";
import { UserFindOptions } from "src/repository/user_findoptions";
import { UserCreateOptions } from "src/repository/user_createoptions";
import RedisService from "./redis.service";
import { CouponService } from "./coupon.service";
import { UserDto } from "src/dto/user.dto";
import { UserEntity } from "src/entity/user.entity";

export class UserService {
    constructor(
        @Inject("UserRepository")
        private readonly userRepository: UserRepository,
        private readonly mailService: EmailService,
        private readonly redisService: RedisService,
        private readonly couponSerive: CouponService,
    ){}

    async getUsers() : Promise<UserDto[]> {
        const caches = await this.redisService.get<UserEntity[]>("users", UserService.name)
        if(caches) return caches.map(u => UserDto.fromEntity(u))

        const entities = await this.userRepository.get()
        return entities.map(u => UserDto.fromEntity(u))
    }

    async getUserBy(args: UserFindOptions) : Promise<UserDto | undefined | null> {
        const caches = await this.redisService.get<UserEntity[]>("users", UserService.name)
        if(caches) {
            const cache = caches.find(u => u.email === args.email)
            if(cache) return UserDto.fromEntity(cache)
        }
        
        const entity = await this.userRepository.getBy(args)
        if(entity) return UserDto.fromEntity(entity)
        
        return entity
    }

    async createUser(data: UserCreateOptions) : Promise<void> {
        // 패스워드 암호화 루틴
        let caches = await this.redisService.get<UserEntity[]>("users", UserService.name)
        if(!caches) caches = [] as UserEntity[]

        const user = await this.userRepository.create(data, "test")
        await this.redisService.set("users", [...caches, user], UserService.name)
    }

    async deleteUser(args: UserFindOptions) : Promise<void> {
        let caches = await this.redisService.get<UserEntity[]>("users", UserService.name)
        if(caches && caches.length > 0) {
            caches = caches.filter(u => u.email !== args.email)
            await this.redisService.set("users", caches, UserService.name)
        }
        return await this.userRepository.deleteBy(args)
    }

    async updateUser(data: UserUpdateOptions, args: UserFindOptions) : Promise<void> {
        const user = await this.userRepository.updateBy(data, args)
        let caches = await this.redisService.get<UserEntity[]>("users", UserService.name)
        if(caches) {
            caches = caches.filter(u => u.email !== args.email)
            caches.push(user)
            await this.redisService.set("users", caches, UserService.name)
        }
    }

    async connectCoupon(coupon: string, args: UserFindOptions) : Promise<unknown> {
        const isExisting = await this.couponSerive.getCouponBy({couponnumber: coupon})
        if(isExisting) {
            let caches = await this.redisService.get<UserEntity[]>("users", UserService.name)
            coupon += `:${isExisting.salePrice}:${isExisting.validAt.toString()}` 

            if(caches) {
                const user = caches.find(u => u.email === args.email)
                if(user && user.coupons.includes(coupon)) return false
            }
            await this.userRepository.connectCoupon(coupon, args)
            .then(async user => {
                if(caches) {
                    caches = caches.filter(u => u.email !== args.email)
                    caches.push(user)
                    await this.redisService.set("users", caches, UserService.name)
                }
                return true
            })
        } else {
            return false
        }
    }
}