import { tags } from "typia"

export type CertificationMail = {
    readonly secret: string & tags.MaxLength<6>
    readonly email: string & tags.Format<"email">
    readonly password: string & tags.MinLength<9> & tags.MaxLength<20>
    readonly name: string & tags.MaxLength<10>
    readonly address: string & tags.MaxLength<50>
}