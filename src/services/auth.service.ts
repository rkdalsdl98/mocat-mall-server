import { Injectable } from "@nestjs/common";
import { JwtAuthFactory } from "src/common/jwt/jwt_auth.factory";
import { IPayload } from "src/interface/jwt/ipayload";
import { UserEntity } from "src/entity/user.entity";
import { ERROR } from "src/common/form/response.form";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtAuthFactory: JwtAuthFactory,
    ){}

    generateRandStr(
        strLen?: number,
        byteLen?: number,
    ) : string {
        const randStr = this.jwtAuthFactory.generateRandStr(byteLen)
        return randStr.substring(0, (strLen ?? randStr.length))
    }

    encryptionPass(pass: string) : { salt: string, hash: string } {
        return this.jwtAuthFactory.encryption(pass)
    }

    async verifyPass(user: UserEntity, pass: string) : Promise<boolean> {
        const { salt, password: compareHash } = user
        const { hash } = this.jwtAuthFactory.encryption(pass, salt)
        
        return hash === compareHash
    }

    async verifyToken(token: string) : Promise<IPayload | typeof ERROR.ExpiredToken> {
        const payload = await this.jwtAuthFactory.verify(token)
        return payload
    }

    async publishToken(payload: Buffer | Object) : Promise<{ accessToken: string }> {
        return this.jwtAuthFactory.publishToken(payload)
    }
}