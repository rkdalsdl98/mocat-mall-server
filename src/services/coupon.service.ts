import { Injectable, Inject } from "@nestjs/common";
import { Coupon, CouponCategory } from "src/types/coupon.types";
import * as dotenv from "dotenv"
import { v4 } from "uuid"
import RedisService from "./redis.service";
import { CouponRepository } from "src/repository/coupon/coupon.repository";
import { CouponEntity } from "src/entity/coupon.entity";

dotenv.config()

@Injectable()
export class CouponService {
    constructor(
        @Inject("CouponRepository")
        private readonly couponRepository: CouponRepository,
        private readonly redisService: RedisService,
    ){}

    async getCoupons() : Promise<CouponEntity[] | CouponEntity | undefined> {
        return await this.couponRepository.get()
    }

    generateCouponCode(
        type: CouponCategory, 
        salePrice: number,
        validAtDay?: number | undefined,
    ) : Coupon<CouponCategory> {
        if(!validAtDay) {
            const defaultDay = process.env.COUPON_VALID_DAY
            if(!defaultDay) throw new Error("환경 설정을 불러오는데 실패했습니다")
            else if(!defaultDay.match(/^[0-9]$/g)) throw new Error("유효하지 않은 설정 값 입니다")
            validAtDay = parseInt(defaultDay)
        }

        const tokens : string[] = v4().split('-')
        // uuid를 아래처럼 인덱싱하면 쿼리에서 키 값으로 찾을때 속도 저하를 막아줌
        // 인덱스 부여는 맘대로 해도 되는 듯??
        // DB에 저장 할때 쿠폰번호 => type:couponnumber 형식으로 저장
        return {
            type: type,
            couponnumber: tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4],
            validAt: new Date(Date.now() + (validAtDay * (24 * (60 * 60000)))),
            salePrice,
        }
    }

    checkValidCoupon(coupon: Coupon<CouponCategory>) : boolean {
        if(coupon.validAt.getTime() <= Date.now()) return false
        switch(coupon.type) {
            case "TEST":
                return true
            case "EVENT":
                // 이벤트 쿠폰 처리
                return false
            case "PAYBACK":
                // 페이백 쿠폰 처리
                return false
        }
    }
}