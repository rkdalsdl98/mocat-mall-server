import { TypedRoute, TypedQuery } from "@nestia/core";
import { Controller, UseInterceptors } from "@nestjs/common";
import { MappingInterceptor } from "src/common/interceptors/mapping.interceptor";
import { IUserQuery } from "src/query/iuser.query";
import { UserService } from "src/services/user.service";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @TypedRoute.Get()
    @UseInterceptors(new MappingInterceptor())
    async getUsers() {
        console.log("controller")
        return this.userService.getUsers()
    }

    @TypedRoute.Patch()
    @UseInterceptors(new MappingInterceptor())
    async updateUser(
        @TypedQuery() query : IUserQuery.IUserQueryUpdateOptions
    ) {
        return "Hello"
    }
}