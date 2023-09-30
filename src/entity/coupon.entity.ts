import { Coupon, CouponCategory } from "src/types/coupon.types"

export interface CouponEntity {
    readonly coupon: Coupon<CouponCategory>
}