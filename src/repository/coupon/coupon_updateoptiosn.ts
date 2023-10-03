import { IUpdateOptions } from "src/interface/options/iupdateoptions"

export interface CouponUpdateOptions extends IUpdateOptions {
    readonly couponnumber: string
    readonly ownerEmail: string
}