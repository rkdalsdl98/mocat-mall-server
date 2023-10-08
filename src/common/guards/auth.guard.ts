import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Request } from 'express';
import { AuthService } from "src/services/auth.service";
import { ERROR } from "../form/response.form";

@Injectable()
export class AuthJwtGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        const reqAddress = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress
        const token = this.extractTokenFromHeader(req)
        if(!token) return false
        const res = await this.authService.verifyToken(token)
        if("statuscode" in res) {
            return false
        } else if("email" in res) {
            const { email } = res
            if(!email || !/^[0-9a-zA-Z]+@[a-zA-Z]+.[a-zA-Z]{2,3}$/g.test(`${email}`)) {
                Logger.error(`[이메일 형식이 아님] 요청 아이피: ${reqAddress}`, AuthJwtGuard.name)
                return false
            }
            req.user = { email }
            return true
        } else {
            Logger.error(`[유효하지 않은 접근 방법] 요청 아이피: ${reqAddress}`, AuthJwtGuard.name)
            return false
        }
    }

    private extractTokenFromHeader(request: Request): string | null {
        const [ type, token ] = request.headers.authorization?.split(" ") ?? []
        if(!type || type !== "Bearer") return null
        return token
    }
}