import { Inject } from "@nestjs/common";
import { UserEntity } from "src/entity/user.entity";
import { UserRepository } from "src/repository/user.repository";
import { EmailService } from "./mailer.service";

export class UserService {
    constructor(
        @Inject("UserRepository")
        private readonly userRepository: UserRepository,
        private readonly mailService: EmailService,
    ){}

    async getUsers() : Promise<UserEntity[]> {
        return await this.userRepository.get()
    }
}