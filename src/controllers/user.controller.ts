import { TypedRoute, TypedQuery, TypedParam } from "@nestia/core";
import { Body, Controller, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtDecorator } from "src/common/decorators/jwt.decorator";
import { ERROR, ResponseFailedForm, TryCatch } from "src/common/form/response.form";
import { AuthJwtGuard } from "src/common/guards/auth.guard";
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
    async getUsers() : Promise<TryCatch<
    | UserDto[]
    | null
    | undefined
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerCacheError
    | typeof ERROR.ServerDatabaseError
    >> {
        const result = await this.userService.getUsers()
        return {
            data: result,
            statuscode: 200,
        }
    }

    /**
     * 입력 했던 정보로 유저정보 조회
     * 
     * @returns 유저정보
     */
    @TypedRoute.Get("/login")
    async login(
        @TypedQuery() query : IUserQuery.IUserQueryLoginOptions,
    ) : Promise<TryCatch<
    { user: UserDto, accessToken: string }
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerCacheError
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.NonAuthoritativeInformation
    | typeof ERROR.NotFoundData
    >> {
        return await this.userService.login({ 
            email: query.email,
            password: query.password,
        })
    }

    /**
     * 이메일로 유저정보 조회
     * 
     * 이메일은 고유한 값으로 저장됨
     * 
     * @returns 유저정보
     * @security bearer
     */
    @TypedRoute.Get("/login/token")
    @UseGuards(AuthJwtGuard)
    async loginByToken(
        @JwtDecorator.GetTokenAndPayload() data: { payload: Object, token: string }
    ) : Promise<TryCatch<
    | UserDto
    | null
    | undefined
    ,
    ResponseFailedForm
    >> {
        if("type" in data.payload && "response" in data.payload) 
            return data.payload.response as ResponseFailedForm

        return await this.userService.getUserBy({ email: data.payload['email'] })
    }

    /**
     * 인증 메일 요청
     */
    @TypedRoute.Post()
    async receiveCreateReq(
        @TypedQuery() query : IUserQuery.IUserQueryCreateOptions,
    ) : Promise<TryCatch<
    boolean
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerCacheError
    | typeof ERROR.FailedSendMail
    >> {
        return await this.userService.createRequest({ ...query })
    }

    /**
     * 유저 정보 등록
     */
    @TypedRoute.Post("/:email")
    async createUser(
        @TypedParam("email") email: string,
        @Body() body : { code: string & tags.MaxLength<6> },
    ) : Promise<TryCatch<
    boolean
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerCacheError
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.NotFoundData
    >> {
        return await this.userService.createUser(body.code, { email })
    }

    /**
     * 쿠폰등록
     * 
     * @security bearer
     */
    @TypedRoute.Patch("coupon/connect")
    @UseGuards(AuthJwtGuard)
    async connectCoupon(
        @TypedQuery() query : IUserQuery.IUserQueryConnectCouponOptions,
        @JwtDecorator.GetTokenAndPayload() data: { payload: Object, token: string },
    ) : Promise<TryCatch<
    boolean
    ,
    ResponseFailedForm
    >> {
        if("type" in data.payload && "response" in data.payload) 
            return data.payload.response as ResponseFailedForm

        return await this.userService.connectCoupon(query.coupon, { email: data.payload['email'] })
    }

    /**
     * 유저 정보 갱신
     * 
     * @security bearer
     */
    @TypedRoute.Patch()
    @UseGuards(AuthJwtGuard)
    async updateUser(
        @TypedQuery() query : IUserQuery.IUserQueryUpdateOptions,
        @JwtDecorator.GetTokenAndPayload() data: { payload: Object, token: string },
    ) : Promise<TryCatch<
    boolean
    , 
    ResponseFailedForm
    >> {
        if("type" in data.payload && "response" in data.payload) 
            return data.payload.response as ResponseFailedForm

        return await this.userService.updateUser({
            name: query.name,
            address: query.address,
        },{ email: data.payload['email'] })
    }

    /**
     * 유저 정보 삭제 (회원탈퇴)
     * 
     * @security bearer
     */
    @TypedRoute.Delete()
    @UseGuards(AuthJwtGuard)
    async deleteUser(
        @JwtDecorator.GetTokenAndPayload() data: { payload: Object, token: string },
    ) : Promise<TryCatch<
    boolean
    ,
    ResponseFailedForm
    >> {
        if("type" in data.payload && "response" in data.payload) 
            return data.payload.response as ResponseFailedForm
        
        return await this.userService.deleteUser({ email: data.payload['email'] })
    }
}