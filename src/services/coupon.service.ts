import { Injectable, Inject } from "@nestjs/common";
import { Coupon, CouponCategory } from "src/types/coupon.types";
import * as dotenv from "dotenv"
import { v4 } from "uuid"
import { CouponRepository } from "src/repository/coupon/coupon.repository";
import { CouponEntity } from "src/entity/coupon.entity";
import { CouponFindOptions } from "src/repository/coupon/coupon_findoptions";
import { CouponCreateOptions } from "src/repository/coupon/coupon_createoptions";
import RedisService from "./redis.service";
import { CouponDto } from "src/dto/coupon.dto";

dotenv.config()

@Injectable()
export class CouponService {
    constructor(
        @Inject("CouponRepository")
        private readonly couponRepository: CouponRepository,
        private readonly redisService: RedisService,
    ){}

    async getCoupons() : Promise<CouponDto[] | undefined> {
        const caches = await this.redisService.get<CouponEntity[]>("coupons", CouponService.name)
        if(caches) {
            const dto = caches.map(c => {
                return {
                    salePrice: c.coupon.salePrice,
                    validAt: new Date(c.coupon.validAt),
                    couponNumber: `${c.coupon.type}:${c.coupon.couponnumber}`
                } as CouponDto
            })
            return dto
        }
        const coupons = await this.couponRepository.get()
        if(coupons) {
            const dto = coupons.map(c => {
                return {
                    salePrice: c.coupon.salePrice,
                    validAt: new Date(c.coupon.validAt),
                    couponNumber: `${c.coupon.type}:${c.coupon.couponnumber}`
                } as CouponDto
            })
            return dto
        }
        return undefined
    }

    async getCouponBy(args: CouponFindOptions) : Promise<CouponDto | null | undefined> {
        const caches = await this.redisService.get<CouponEntity[]>("coupons", CouponService.name)
        if(caches) {
            const cache = caches.find(c => `${c.coupon.type}:${c.coupon.couponnumber}` === args.couponnumber)
            if(cache) return {
                salePrice: cache.coupon.salePrice,
                validAt: new Date(cache.coupon.validAt),
                couponNumber: `${cache.coupon.type}:${cache.coupon.couponnumber}`
            } as CouponDto

        const coupon = await this.couponRepository.getBy(args)
        if(coupon) {
                const dto = {
                    salePrice: coupon.coupon.salePrice,
                    validAt: new Date(coupon.coupon.validAt),
                    couponNumber: `${coupon.coupon.type}:${coupon.coupon.couponnumber}`
                } as CouponDto
                return dto
            }
        }
        return undefined
    }

    async deleteCoupon(args: CouponFindOptions) : Promise<void> {
        let caches = await this.redisService.get<CouponEntity[]>("coupons", CouponService.name)
        if(caches) {
            caches = caches.filter(c => `${c.coupon.type}:${c.coupon.couponnumber}` !== args.couponnumber)
            await this.redisService.set("copons", caches, CouponService.name)
        }
        return await this.couponRepository.deleteBy(args)
    }
    
    async createCoupon(data: CouponCreateOptions) : Promise<void> {
        let coupon : Coupon<CouponCategory> = this.generateCouponCode(data.type as CouponCategory, data.salePrice)
        let caches = await this.redisService.get<CouponEntity[]>("coupons", CouponService.name)

        if(caches) {
            let isDuplicate = true
            while(isDuplicate) {
                const isAlready = caches.find(c => `${c.coupon.type}:${c.coupon.couponnumber}` === `${coupon.type}:${coupon.couponnumber}`)
                if(isAlready) {
                    coupon = this.generateCouponCode(data.type as CouponCategory, data.salePrice)
                    continue
                } else break
            }
        } else caches = [] as CouponEntity[]

        const entity = await this.couponRepository.create(coupon)
        await this.redisService.set("coupons", [...caches, entity], CouponService.name)
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
            default:
                return false
        }
    }
}