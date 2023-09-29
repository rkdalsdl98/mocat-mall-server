import { Inject } from "@nestjs/common";
import { UserEntity } from "src/entity/user.entity";
import { UserRepository } from "src/repository/user.repository";
import { EmailService } from "./mailer.service";
import { UserUpdateOptions } from "src/repository/user_updateoptions";
import { UserFindOptions } from "src/repository/user_findoptions";
import { UserCreateOptions } from "src/repository/user_createoptions";

export class UserService {
    constructor(
        @Inject("UserRepository")
        private readonly userRepository: UserRepository,
        private readonly mailService: EmailService,
    ){}

    async getUsers() : Promise<UserEntity[]> {
        console.log("service")
        return await this.userRepository.get()
    }

    async createUser(data: UserCreateOptions) : Promise<UserEntity> {
        return await this.userRepository.create(data)
    }

    async deleteUser(args: UserFindOptions) : Promise<void> {
        return await this.userRepository.deleteBy(args)
    }

    async updateUser(data: UserUpdateOptions, args: UserFindOptions) : Promise<void> {
        return await this.userRepository.updateBy(data, args)
    }
}