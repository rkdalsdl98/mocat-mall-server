import { TypedRoute, TypedParam, TypedQuery } from "@nestia/core";
import { Query, Controller } from "@nestjs/common";
import { IUserQuery } from "src/interface/query/iquery";
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

    @TypedRoute.Patch()
    async updateUser(
        @TypedQuery() query : IUserQuery.IUpdate
    ) {
        console.log(query)
    }
}