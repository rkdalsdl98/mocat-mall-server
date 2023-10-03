import { ICreateOptions } from "src/interface/options/icreateoptions"
import { CouponCategory } from "src/types/coupon.types"

export interface CouponCreateOptions extends ICreateOptions {
    readonly salePrice: number
    readonly type: CouponCategory
    readonly couponnumber?: string
    readonly validAt?: Date
}