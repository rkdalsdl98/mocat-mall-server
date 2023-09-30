import { TypedRoute, TypedQuery, TypedParam } from "@nestia/core";
import { Controller, UseInterceptors } from "@nestjs/common";
import { MappingInterceptor } from "src/common/interceptors/mapping.interceptor";
import { IUserQuery } from "src/query/iuser.query";
import { UserService } from "src/services/user.service";
import { tags } from "typia"

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}
    
    // 가드로 토큰을 통해 진행될 거임
    // 테스트용
    @TypedRoute.Get()
    async getUsers() {
        return this.userService.getUsers()
    }

    // 가드로 토큰을 통해 진행될 거임
    @TypedRoute.Get("/:email")
    async getUserBy(
        @TypedParam("email") email: string & tags.Format<"email">
    ) {
        return this.userService.getUserBy({email})
    }

    @TypedRoute.Post()
    @UseInterceptors(new MappingInterceptor())
    async createUser(
        @TypedQuery() query : IUserQuery.IUserQueryCreateOptions
    ) : Promise<any> {
        return this.userService.createUser({
            name: query.name,
            password: query.password,
            email: query.email,
            address: query.address,
        })
    }

    // 가드로 토큰을 확인 하고 진행될 거임
    @TypedRoute.Patch()
    async updateUser(
        @TypedQuery() query : IUserQuery.IUserQueryUpdateOptions
    ) {
        return await this.userService.updateUser({
            name: query.name,
            address: query.address,
        },{
            id: query.id,
            email: query.email,
        })
    }

    // 가드로 토큰을 통해 진행될 거임
    @TypedRoute.Delete("/:email")
    async deleteUser(
        @TypedParam("email") email: string & tags.Format<"email">
    ) : Promise<void> {
        return await this.userService.deleteUser({email})
    }
}