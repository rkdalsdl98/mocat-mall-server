import { CouponCategory } from "src/types/coupon.types"

export interface CouponCreateOptions {
    readonly salePrice: number
    readonly type: CouponCategory
    readonly couponnumber?: string
    readonly validAt?: Date
}