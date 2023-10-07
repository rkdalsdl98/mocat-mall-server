import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { pbkdf2Sync, randomBytes } from "crypto";
import { v4 } from "uuid"
import { ERROR } from "../form/response.form";
import { IPayload } from "src/interface/jwt/ipayload";
import * as dotenv from "dotenv"

dotenv.config()

// Jwt 관련설정은 수동으로 개발, 배포 환경으로 바꾸어 주어아 함
@Injectable()
export class JwtAuthFactory {
    constructor(
        @Inject("JwtService")
        private readonly jwtService: JwtService,
    ){}

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
            parseInt(process.env.JWT_CREATE_ITERATIONS ?? "200216"), 
            64, 
            'sha256',
        ).toString('base64')
        
        return { salt, hash }
    }

    generateRandStr(byteLen?: number,) : string {
        return randomBytes(byteLen ?? 6).toString("base64")
    }

    async publishToken(payload: Buffer | Object) : Promise<{ accessToken: string }> {
        const accessToken : string = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET_DEV,
            expiresIn: parseInt(process.env.JWT_EXPIRES_MINUTES_DEV ?? "1") * 60
        })
        return { accessToken }
    }

    async verify(token: string) : Promise<IPayload> {
        const payload = await this.jwtService.verifyAsync(token, { 
            secret: process.env.JWT_SECRET_DEV, 
            ignoreExpiration: true,
        })
        
        const { exp } = payload
        const now = Date.now() / 1000
        
        // Refresh를 구현하지 않아 만료된 토큰은 바로 오류처리
        if(!exp || now > exp) throw ERROR.ExpiredToken
        return payload
    }
}