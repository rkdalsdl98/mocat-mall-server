import { TypedRoute, TypedQuery, TypedParam } from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { GetToken } from "src/common/decorators/jwt.decorator";
import { ERROR, TryCatch } from "src/common/form/response.form";
import { UserDto } from "src/dto/user.dto";
import { IUserQuery } from "src/query/iuser.query";
import { UserService } from "src/services/user.service";
import { tags } from "typia"

@Controller('user')
@ApiTags("유저")
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}
    
    // 테스트용
    /**
     * 테스트용
     * 유저 정보 조회
     * 
     * 클라이언트에서 유저정보를 모두 조회하는 상황은 없음
     * 
     * @returns 모든 유저 정보
     * @security bearer
     */
    @TypedRoute.Get()
    async getUsers(
        @TypedQuery() query : IUserQuery
    ) : Promise<TryCatch<
    | UserDto[]
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerCacheError
    | typeof ERROR.ServerDatabaseError
    >> {
        return {
            data: await this.userService.getUsers(),
            statuscode: 200,
        }
    }

    /**
     * 이메일로 유저 정보 조회
     * 
     * 이메일은 고유한 값으로 저장됨
     * 
     * @returns 유저정보
     * @security bearer
     */
    @TypedRoute.Get("/byemail")
    async getUserBy(
        @TypedQuery() query : IUserQuery,
    ) : Promise<TryCatch<
    | UserDto
    | null
    | undefined
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerCacheError
    | typeof ERROR.ServerDatabaseError
    >> {
        return {
            data: await this.userService.getUserBy({ email: query.email }),
            statuscode: 200,
        }
    }

    /**
     * 유저 정보 등록
     * 
     * @security bearer
     */
    @TypedRoute.Post()
    async createUser(
        @TypedQuery() query : IUserQuery.IUserQueryCreateOptions
    ) : Promise<unknown> {
        return this.userService.createUser({
            name: query.name,
            password: query.password,
            email: query.email,
            address: query.address,
        })
    }

    /**
     * 쿠폰등록
     * 
     * @security bearer
     */
    @TypedRoute.Patch("coupon/connect")
    async connectCoupon(
        @TypedQuery() query : IUserQuery.IUserQueryConnectCouponOptions
    ) : Promise<unknown> {
        return this.userService.connectCoupon(query.coupon, { email: query.email })
    }

    /**
     * 유저 정보 갱신
     * 
     * @security bearer
     */
    @TypedRoute.Patch()
    async updateUser(
        @TypedQuery() query : IUserQuery.IUserQueryUpdateOptions
    ) {
        return await this.userService.updateUser({
            name: query.name,
            address: query.address,
        },{ email: query.email })
    }

    /**
     * 유저 정보 삭제 (회원탈퇴)
     * 
     * @security bearer
     */
    @TypedRoute.Delete("/:email")
    async deleteUser(
        @TypedParam("email") email: string & tags.Format<"email">
    ) : Promise<void> {
        return await this.userService.deleteUser({email})
    }
}