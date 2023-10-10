import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CouponEntity } from "src/entity/coupon.entity";
import { IRepository } from "src/interface/respository/irepository";
import { Coupon, CouponCategory } from "src/types/coupon.types";
import { CouponFindOptions } from "./coupon_findoptions";
import { CouponCreateOptions } from "./coupon_createoptions";
import { CouponUpdateOptions } from "./coupon_updateoptiosn";
import { ERROR } from "src/common/form/response.form";

@Injectable()
export class CouponRepository extends PrismaClient implements IRepository<CouponEntity>, OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect()
        .then(_=> Logger.log("Connected database server.", CouponRepository.name))
        .catch(err => Logger.error(`Failed connected database server.`, err, CouponRepository.name))
    }
    
    async onModuleDestroy() {
        await this.$disconnect()
        .then(_ => Logger.log("Disconnected database server.", CouponRepository.name))
        .catch(err => Logger.error(`Cannot disconnected database server.`, err, CouponRepository.name))
    }
    
    async get(args?: CouponFindOptions): Promise<CouponEntity[]> {
        return (await this.coupon.findMany({
            where: { couponNumber: args?.couponnumber },
        })
        .catch(err => { 
            Logger.error(`쿠폰 정보 조회 실패`, err.toString(), CouponRepository.name) 
            throw  ERROR.ServerDatabaseError 
        }))
        .map(e => {
            return this.toEntity(e)
        })
    }

    async getBy(args: CouponFindOptions): Promise<CouponEntity | null | undefined> {
        return await this.coupon.findUnique({
            where: { couponNumber: args.couponnumber }
        })
        .then(v => {
            if(v) return this.toEntity(v)
            return v
        })
        .catch(err => {
            Logger.error(`쿠폰 정보 조회 실패`, err.toString(), CouponRepository.name) 
            throw  ERROR.ServerDatabaseError
        })
    }

    // 보류
    async updateBy(data: CouponUpdateOptions, args: CouponFindOptions): Promise<void> {
        await this.coupon.update({
            data: {},
            where: {couponNumber: args.couponnumber}
        })
        .catch(err => {
            Logger.error(`유저 쿠폰 등록 실패`, err.toString(), CouponRepository.name) 
            throw  ERROR.ServerDatabaseError
        })
    }


    async deleteBy(args: CouponFindOptions): Promise<void> {
        await this.coupon.delete({
            where: { couponNumber: args.couponnumber }
        }).catch(err => {
            Logger.error(`쿠폰 정보 삭제 실패`, err.toString(), CouponRepository.name) 
            throw  ERROR.ServerDatabaseError
         })
    }

    // 등록은 어드민만
    async create(data: CouponCreateOptions, args?: CouponFindOptions): Promise<CouponEntity> {
        return this.toEntity(await this.coupon.create({
            data: {
                salePrice: data.salePrice,
                validAt: data.validAt,
                couponNumber: `${data.type as CouponCategory}:${data.couponnumber}`,
            }
        }).catch(err => {
            Logger.error(`쿠폰 정보 등록 실패`, err.toString(), CouponRepository.name) 
            throw ERROR.ServerDatabaseError
        }))
    }

    toEntity(v): CouponEntity {
        const { salePrice, validAt, couponNumber } = v
        const [ type, number ] = couponNumber.split(":")

        switch(type) {
            case "TEST":
                return {
                    coupon: {
                        type,
                        couponnumber: number,
                        validAt,
                        salePrice,
                    } as Coupon<"TEST">,
                    userId: v.userId,
                } as CouponEntity
            case "EVENT":
                return {
                    coupon: {
                        type,
                        couponnumber: number,
                        validAt,
                        salePrice,
                    } as Coupon<"EVENT">,
                    userId: v.userId,
                } as CouponEntity
            case "PAYBACK":
                return {
                    coupon: {
                        type,
                        couponnumber: number,
                        validAt,
                        salePrice,
                    } as Coupon<"PAYBACK">,
                    userId: v.userId,
                } as CouponEntity
            default:
                throw new Error("유효하지 않은 쿠폰")
        }
    }
}