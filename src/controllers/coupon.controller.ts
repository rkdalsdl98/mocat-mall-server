import { TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { CouponEntity } from "src/entity/coupon.entity";
import { CouponService } from "src/services/coupon.service";

@Controller("coupon")
export class CouponController {
    constructor(
        private readonly couponService: CouponService
    ){}

    @TypedRoute.Get()
    async getCoupons() : Promise<CouponEntity[] | CouponEntity | undefined> {
        return await this.couponService.getCoupons()
    }
}