import { TypedRoute, TypedParam } from "@nestia/core";
import { Body, Controller } from "@nestjs/common";
import { UserService } from "src/services/user.service";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @TypedRoute.Get()
    async getUsers() {
        return this.userService.getUsers()
    }
}