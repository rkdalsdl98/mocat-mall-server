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
        return await this.userRepository.get()
    }

    async getUserBy(args: UserFindOptions) : Promise<UserEntity | undefined | null> {
        return await this.userRepository.getBy(args)
    }

    async createUser(data: UserCreateOptions) : Promise<void> {
        // 패스워드 암호화 루틴
        return await this.userRepository.create(data, "test")
    }

    async deleteUser(args: UserFindOptions) : Promise<void> {
        return await this.userRepository.deleteBy(args)
    }

    async updateUser(data: UserUpdateOptions, args: UserFindOptions) : Promise<void> {
        return await this.userRepository.updateBy(data, args)
    }
}