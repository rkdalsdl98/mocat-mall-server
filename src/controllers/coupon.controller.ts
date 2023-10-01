import { TypedParam, TypedQuery, TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { CouponDto } from "src/dto/coupon.dto";
import { ICouponQuery } from "src/query/icoupon.query";
import { CouponService } from "src/services/coupon.service";
import { CouponCategory } from "src/types/coupon.types";

@Controller("coupon")
export class CouponController {
    constructor(
        private readonly couponService: CouponService
    ){}

    @TypedRoute.Get()
    async getCoupons(
        @TypedQuery() query : ICouponQuery
    ) : Promise<CouponDto[] | undefined> {
        return await this.couponService.getCoupons()
    }

    /**
     * 쿼리 파라미터로 받아오는 쿠폰 번호는 파싱이전 정보
     * type:couponnumber
     */
    @TypedRoute.Get("/:couponnumber")
    async getCoupon(
        @TypedQuery() query : ICouponQuery,
        @TypedParam("couponnumber") couponnumber: string
    ) : Promise<CouponDto | null | undefined> {
        return await this.couponService.getCouponBy({couponnumber})
    }

    @TypedRoute.Post("create")
    async createCoupon(
        @TypedQuery() query : ICouponQuery.ICouponQueryCreateOptions
    ) : Promise<void> {
        return await this.couponService.createCoupon({
            type: query.type as CouponCategory,
            salePrice: query.salePrice ?? 1_000,
        })
    }

    @TypedRoute.Delete("/:couponnumber")
    async deleteCoupon(
        @TypedQuery() query : ICouponQuery,
        @TypedParam("couponnumber") couponnumber: string
    ) : Promise<void> {
        return await this.couponService.deleteCoupon({couponnumber})
    }
}