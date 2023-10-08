import { Injectable } from "@nestjs/common";
import { JwtModuleOptions, JwtService } from "@nestjs/jwt";
import { pbkdf2Sync, randomBytes } from "crypto";
import { v4 } from "uuid"
import { ERROR } from "../form/response.form";
import { IPayload } from "src/interface/jwt/ipayload";
import jwtConfig from "jwt.config";

@Injectable()
export class JwtAuthFactory {
    private configs : { config: JwtModuleOptions, dependenciesConfig: Object }
    
    constructor(
        private readonly jwtService: JwtService,
    ){
        this.configs = jwtConfig()
    }

    encryption(data: string, salt?: string) : { salt: string, hash: string} {
        if(!salt) {
            const randByteStr = randomBytes(32).toString('base64')
            const uid = v4()
            salt = `${uid}:${randByteStr}`
        }

        const buffer : Buffer = Buffer.from(data, 'utf-8')
        const hash = pbkdf2Sync(
            buffer, 
            salt, 
            parseInt(this.configs.dependenciesConfig['createIterations'] ?? "200216"), 
            64, 
            this.configs.dependenciesConfig['algorithm'],
        ).toString('base64')
        
        return { salt, hash }
    }

    generateRandStr(byteLen?: number,) : string {
        return randomBytes(byteLen ?? 6).toString(this.configs.dependenciesConfig['encoding'])
    }

    async publishToken(payload: Buffer | Object) : Promise<{ accessToken: string }> {
        const accessToken : string = await this.jwtService.signAsync(payload, {
            secret: this.configs.config.secret,
            expiresIn: this.configs.config.signOptions?.expiresIn,
        })
        return { accessToken }
    }

    async verify(token: string) : Promise<IPayload | typeof ERROR.ExpiredToken> {
        const payload = await this.jwtService.verifyAsync(token, { 
            secret: this.configs.config.secret,
            ignoreExpiration: true,
        })
        
        const { exp } = payload
        const now = Date.now() / 1000
        
        // Refresh를 구현하지 않아 만료된 토큰은 바로 오류처리
        if(!exp || now > exp) return ERROR.ExpiredToken
        return payload
    }
}