import { TypedParam, TypedQuery, TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { CouponDto } from "src/dto/coupon.dto";
import { ICouponQuery } from "src/query/icoupon.query";
import { CouponService } from "src/services/coupon.service";
import { ApiTags } from "@nestjs/swagger";
import { CouponCategory } from "src/types/coupon.types";

@Controller("coupon")
@ApiTags("쿠폰")
export class CouponController {
    constructor(
        private readonly couponService: CouponService
    ){}
    
    /**
     * 쿠폰 정보 조회
     * 
     * @returns 모든 쿠폰 정보
     * @security bearer
     */
    @TypedRoute.Get()
    async getCoupons(
        @TypedQuery() query : ICouponQuery
    ) : Promise<CouponDto[] | undefined> {
        return await this.couponService.getCoupons()
    }

    /**
     * 쿠폰 정보 조회
     * 
     * 쿼리 파라미터로 받아오는 쿠폰 번호는 파싱이전 정보
     * type:couponnumber
     * 
     * @returns 쿠폰 정보
     * @security bearer
     */
    @TypedRoute.Get("/:couponnumber")
    async getCoupon(
        @TypedQuery() query : ICouponQuery,
        @TypedParam("couponnumber") couponnumber: string
    ) : Promise<CouponDto | null | undefined> {
        return await this.couponService.getCouponBy({couponnumber})
    }

    /**
     * 쿠폰 등록
     * 
     * 어드민만 등록이 가능
     * 
     * @security bearer
     */
    @TypedRoute.Post("create")
    async createCoupon(
        @TypedQuery() query : ICouponQuery.ICouponQueryCreateOptions
    ) : Promise<void> {
        return await this.couponService.createCoupon({
            type: query.type as CouponCategory,
            salePrice: query.salePrice ?? 1_000,
        })
    }

    /**
     * 쿠폰 삭제(사용)
     * 
     * 1회성 쿠폰을 삭제하는 라우터
     * 
     * @security bearer
     */
    @TypedRoute.Delete("/:couponnumber")
    async deleteCoupon(
        @TypedQuery() query : ICouponQuery,
        @TypedParam("couponnumber") couponnumber: string
    ) : Promise<void> {
        return await this.couponService.deleteCoupon({couponnumber})
    }
}