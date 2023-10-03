import { CouponEntity } from "src/entity/coupon.entity"

export class CouponDto {
    constructor(
        readonly salePrice: number,
        readonly validAt: Date,
        readonly couponNumber: string,
    ){}

    static parseCouponMetadata(meta: string) : unknown {
        const parseMeta = meta.split(":")
        if(parseMeta.length !== 4) return

        return {
            salePrice: parseInt(parseMeta[2]),
            validAt: new Date(parseMeta[3]),
            couponNumber: `${parseMeta[0]}:${parseMeta[1]}`
        } as CouponDto
    }

    static fromEntity(entity: CouponEntity) : CouponDto {
        return {
            salePrice: entity.coupon.salePrice,
            validAt: entity.coupon.validAt,
            couponNumber: `${entity.coupon.type}:${entity.coupon.couponnumber}`
        } as CouponDto
    }
}