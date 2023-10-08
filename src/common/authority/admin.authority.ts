import { 
    pbkdf2Sync, 
    randomBytes,
    createCipheriv,
    createDecipheriv,
} from "crypto";
import { v4 } from "uuid"
import { authorityConfig } from "authority.config";
import { 
    Logger, 
    UnauthorizedException,
} from "@nestjs/common";

const config = authorityConfig()

export type AuthorityType = "employee" | "leader" | "chief"
/**
 * authoritycode
 * * 권한을 부여 받은 사람이 가지고 있어야 함
 * * 권한을 가진 JWT토큰 payload에 담길 코드
 * 
 * salt
 * * authoritycode 복호화한 이후에 나오는 코드를 암호화 하는데 사용 됨
 * * 어드민 테이블에 저장 됨
 * 
 * hash
 * * authoritycode 복호화한 이후에 나오는 코드를 암호화 한 이후
 * 올바른 코드인지 비교할 원본 해쉬
 * * 어드민 테이블에 저장 됨
 */
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
export const verify = (
    authoritycode: string,
    comparecode: string,
    salt: string
)
: { result: boolean, authority?: AuthorityType, error?: string } | null => {
    const key = config.authorityKey
    const iv = config.authorityIv
    if(key ===  undefined || iv === undefined) {
        console.log(`[설정누락] 권한 관련 설정이 누락 되었습니다.`)
        return { result: false, error: "ServiceUnavailableException" }
    }

    const decipher = createDecipheriv(
        config.cipherAlgorithm ?? "aes-256-cbc",
        key,
        iv,
    )
    try {
        let decode = decipher.update(
            authoritycode, 
            'utf-8', 
            config.encoding as BufferEncoding ?? "base64"
        )
        decode += decipher.final(config.encoding as BufferEncoding ?? "base64")
        const [ authority, code ] = decode.split(":")
        if(!authority || !code) throw new UnauthorizedException()
        
        const { hash } = encryption(code, salt)
        const { hash: comparehash } = encryption(comparecode, salt)
        if(hash !== comparehash) throw new UnauthorizedException()

        switch(authority) {
            case "employee":
                return { result: true, authority }
            case "leader":
                return { result: true, authority }
            case "chief":
                return { result: true, authority }
            default:
                throw new UnauthorizedException()
        }
    } catch(e) {
        Logger.error(`유효하지 않은 코드`, e.toString(), "AdminAuthority")
        return null
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