import { tags } from "typia"

export interface ICouponQuery {
    readonly coupon: string & tags.MaxLength<44> // "쿠폰식별자<10>:쿠폰번호<32> 여유 2"
}
export namespace ICouponQuery {
    export interface ICouponQueryUpdateOptions extends ICouponQuery {
        readonly salePrice?: number & tags.Type<"int32">
    }
}