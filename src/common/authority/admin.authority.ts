import { 
    pbkdf2Sync, 
    randomBytes,
    createCipheriv,
    createDecipheriv,
} from "crypto";
import { v4 } from "uuid"
import { authorityConfig } from "authority.config";
import { ERROR, ResponseFailedForm } from "../form/response.form";

const config = authorityConfig()
export type AuthorityType = "employee" | "leader" | "chief" | "none"
/**
 * authoritycode
 * * 권한을 부여 받은 사람이 가지고 있어야 함
 * * 권한을 가진 JWT토큰 payload에 담길 코드
 */
export namespace AdminAuthority {
    export const publishAdminAuthority = (
        authority: AuthorityType,
        basecode: string,
    ) 
    : { authoritycode: string } | null => {
        const key = config.authorityKey
        const iv = config.authorityIv
        if(key ===  undefined || iv === undefined) {
            console.log(`[설정누락] 권한 관련 설정이 누락 되었습니다.`)
            return null
        }
        
        const cipher = createCipheriv(
            config.cipherAlgorithm ?? "aes-256-cbc",
            key,
            iv,
        )
        let authoritycode = cipher.update(
            `${authority}:${basecode}`, 'utf-8', 
            config.encoding as BufferEncoding ?? "base64"
        )
        authoritycode += cipher.final(config.encoding as BufferEncoding ?? "base64")
        return { authoritycode }
    }
    /**
     * 1차로 authoritycode 코드를 복호화함
     * 
     * 2차로 authoritycode 코드를 복호화하고 나온 코드를 
     * salt로 암호화 한 이후 compareHash과 비교 함
     * 
     * 3차로 authority가 서버에서 부여한 권한 범위에 있는지 확인 함
     */
    export const publicVerify = (authoritycode: string)
    :
    { result: boolean, authority: AuthorityType, code: string }
    | { type: string, response: ResponseFailedForm }=> {
        const key = config.authorityKey
        const iv = config.authorityIv
        if(key ===  undefined || iv === undefined) {
            console.log(`[설정누락] 권한 관련 설정이 누락 되었습니다.`)
            return { type: "ServiceUnavailableException", response: ERROR.ServiceUnavailableException }
        }
    
        const decipher = createDecipheriv(
            config.cipherAlgorithm ?? "aes-256-cbc",
            key,
            iv,
        )
    
        let decode = decipher.update(
            authoritycode, 
            'utf-8', 
            config.encoding as BufferEncoding ?? "base64"
        )
        decode += decipher.final(config.encoding as BufferEncoding ?? "base64")
        const [ authority, code ] = decode.split(":")
        if(!authority || !code) return { type: "UnAuthorized", response: ERROR.UnAuthorized }
    
        switch(authority) {
            case "employee":
            case "leader":
            case "chief":
            case "none":
                return { result: true, authority, code }
            default:
                return { type: "UnAuthorized", response: ERROR.UnAuthorized }
        }
    }
    export const privateVerify = (
        salt: string,
        code: string,
        comparecode: string,
    ) : boolean => {
        const { hash } = encryption(code, salt)
        const { hash: comparehash } = encryption(comparecode, salt)
        return hash !== comparehash
    }
}

const encryption = (data: string, salt?: string) : { salt: string, hash: string} => {
    if(!salt) {
        const randByteStr = randomBytes(32).toString(config.encoding as BufferEncoding ?? "base64")
        const uid = v4()
        salt = `${uid}:${randByteStr}`
    }

    const buffer : Buffer = Buffer.from(data, 'utf-8')
    const hash = pbkdf2Sync(
        buffer, 
        salt, 
        parseInt(config.iterations ?? "202308"), 
        64, 
        config.algorithm ?? 'sha256',
    ).toString(config.encoding as BufferEncoding ?? "base64")
    
    return { salt, hash }
}