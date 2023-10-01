import { Inject } from "@nestjs/common";
import { UserEntity } from "src/entity/user.entity";
import { UserRepository } from "src/repository/user.repository";
import { EmailService } from "./mailer.service";
import { UserUpdateOptions } from "src/repository/user_updateoptions";
import { UserFindOptions } from "src/repository/user_findoptions";
import { UserCreateOptions } from "src/repository/user_createoptions";
import RedisService from "./redis.service";
import { CouponService } from "./coupon.service";

export class UserService {
    constructor(
        @Inject("UserRepository")
        private readonly userRepository: UserRepository,
        private readonly mailService: EmailService,
        private readonly redisService: RedisService,
        private readonly couponSerive: CouponService,
    ){}

    async getUsers() : Promise<UserEntity[]> {
        const caches = await this.redisService.get<UserEntity[]>("users", UserService.name)
        if(caches) return caches
        return await this.userRepository.get()
    }

    async getUserBy(args: UserFindOptions) : Promise<UserEntity | undefined | null> {
        const caches = await this.redisService.get<UserEntity[]>("users", UserService.name)
        if(caches) {
            const cache = caches.find(u => u.email === args.email)
            if(cache) return cache
        }
        return await this.userRepository.getBy(args)
    }

    async createUser(data: UserCreateOptions) : Promise<void> {
        // 패스워드 암호화 루틴
        let caches = await this.redisService.get<UserEntity[]>("users", UserService.name)
        const user = await this.userRepository.create(data, "test")
        if(!caches) caches = [] as UserEntity[]
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
            await this.userRepository.connectCoupon(coupon, args)
            .then(async user => {
                let caches = await this.redisService.get<UserEntity[]>("users", UserService.name)
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