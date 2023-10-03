export type CouponCategory = "TEST" | "EVENT" | "PAYBACK"
export type Coupon<CouponCategory> = {
    readonly type: CouponCategory
    readonly couponnumber: string
    readonly validAt: Date
    readonly salePrice: number
}