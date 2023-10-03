import { IFindOptions } from "src/interface/options/ifindoptions";

export interface CouponFindOptions extends IFindOptions {
    readonly couponnumber: string // 파싱되지 않은 쿠폰번호
                                  // type:couponnumber
}