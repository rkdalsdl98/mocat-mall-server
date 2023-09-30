import { Module } from "@nestjs/common";
import { CouponRepository } from "src/repository/coupon/coupon.repository";
import { CouponService } from "src/services/coupon.service";
import RedisService from "src/services/redis.service";

@Module({
    providers: [
        CouponService,
        RedisService,
        {
            provide: "CouponRepository",
            useClass: CouponRepository,
        }
    ],
    exports: [CouponService]
})
export class CouponModule {}