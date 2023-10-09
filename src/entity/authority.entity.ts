import { AuthorityType } from "src/common/authority/admin.authority"

export interface AuthorityEntity {
    readonly uuid: string
    readonly salt: string
    readonly code: string
    readonly type: AuthorityType
    readonly createdAt: Date
}