import { tags } from "typia"
import { IOptionsQuery } from "./ioptions.query"

export interface ICouponQuery extends IOptionsQuery {
    readonly coupon: string & tags.MinLength<37> & tags.MaxLength<39>
}
export namespace ICouponQuery {
    export interface ICouponQueryCreateOptions extends ICouponQuery {
        readonly type: string & tags.MaxLength<10>
        readonly salePrice?: number & tags.Type<"int32">
    }
}