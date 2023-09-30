export interface CouponCreateOptions {
    readonly salePrice: number
    readonly type: string
    readonly couponnumber?: string
    readonly validAt?: Date
}