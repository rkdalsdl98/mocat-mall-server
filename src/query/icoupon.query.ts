import { tags } from "typia"

export interface ICouponQuery {
    readonly email?: string & tags.Format<"email">
    readonly name?: string & tags.MaxLength<10>
}
export namespace ICouponQuery {
    export interface ICouponQueryCreateOptions extends ICouponQuery {
        readonly type: string & tags.MaxLength<10>
        readonly salePrice?: number & tags.Type<"int32">
    }
}