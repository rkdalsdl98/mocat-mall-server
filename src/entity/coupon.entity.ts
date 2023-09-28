export interface CouponEntity {
    readonly salePrice: number
    readonly validAt: Date
    readonly couponNumber: string
    readonly userId: number
}