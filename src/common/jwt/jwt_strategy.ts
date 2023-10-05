import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import jwtConfig from "jwt.config";
import { ExtractJwt, Strategy } from "passport-jwt"

const config = jwtConfig()
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly jwtService: JwtService) {
        super({
            secretOrKey: config.secret,
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderWithScheme('Mocat'),
            ]),
        })
    }

    async validate(payload) {
        const { email } = payload
        console.log(payload)
        return { email }
    }
}