import { Injectable } from "@nestjs/common";
import { JwtAuthFactory } from "src/common/jwt/jwt_auth.factory";
import { IPayload } from "src/interface/jwt/ipayload";
import { UserEntity } from "src/entity/user.entity";
import { ERROR } from "src/common/form/response.form";
import { 
    publishAdminAuthority,
    publicVerify,
} from "src/common/authority/admin.authority";

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

    async verifyToken(token: string) : Promise<
    IPayload
    | never
    | typeof ERROR.ExpiredToken
    | typeof ERROR.UnAuthorized
    > {
        const result = await this.jwtAuthFactory.verify(token)
        if("payload" in result) {
            if("code" in result.payload) {
                const { code } = result.payload as IPayload.IPayloadEmployee
                if(code === undefined) return result.payload
                const authVerify = publicVerify(code)
                if("authority" in authVerify) {
                    result.payload['authority'] = authVerify.authority
                    result.payload['code'] = authVerify.code
                    return result.payload as IPayload.IPayloadEmployee
                } else authVerify
            } else return result.payload
        } else return result

        // never
        return result.payload
    }

    async publishToken(user: UserEntity) : Promise<{ accessToken: string }> {
        const { authority: userAuth } = user
        if(userAuth === null) return this.jwtAuthFactory.publishToken({ email: user.email })
        else {
            const result = publishAdminAuthority(userAuth.type, userAuth.code)
            if(result === null) return this.jwtAuthFactory.publishToken({ email: user.email })
            else return this.jwtAuthFactory.publishToken({ email: user.email, code: result.authoritycode })
        }
    }
}