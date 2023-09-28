import { OnModuleDestroy, OnModuleInit, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CouponEntity } from "src/entity/coupon.entity";
import { QABoardEntity } from "src/entity/qaboard.entity";
import { UserEntity } from "src/entity/user.entity";
import { SimpleProductModel } from "src/model/simple_product.model";
import { UserFindOptions } from "./user_findoptions";
import { UserUpdateOptions } from "./user_updateoptions";
import { IRepository } from "src/interface/respository/irepository";
import { UserCreateOptions } from "./user_createoptions";

export class UserRepository extends PrismaClient implements IRepository<UserEntity>, OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect()
        .then(_=> Logger.log("Connected database server.", UserRepository.name))
        .catch(err => Logger.error(`Failed connected database server.`, err, UserRepository.name))
    }
    
    async onModuleDestroy() {
        await this.$disconnect()
        .then(_ => Logger.log("Disconnected database server.", UserRepository.name))
        .catch(err => Logger.error(`Cannot disconnected database server.`, err, UserRepository.name))
    }

    async get(args?: UserFindOptions): Promise<UserEntity[]> {
        return (await this.user.findMany({
            include: {
                qaboards: true,
                coupons: true,
            },
            where: {
                id: args?.id,
                email: args?.email,
            }
        })
        .catch(err => { 
            Logger.error(`유저 정보 조회 실패`, err.toString(), UserRepository.name) 
            throw err 
        }))
        .map(e => {
            return this.toEntity(e)
        })
    }
    async getBy(args?: UserFindOptions): Promise<UserEntity | null | undefined> {
        const user = await this.user.findUnique({
            include: {
                qaboards: true,
                coupons: true,
            },
            where: {
                id: args?.id,
                email: args?.email,
            }
        })
        .catch(err => { 
            Logger.error(`유저 정보 조회 실패`, err.toString(), UserRepository.name) 
            throw err 
        })
        if(user) {
            return this.toEntity(user)
        } else {
            return null
        }
    }
    async updateBy(data: UserUpdateOptions, args?: UserFindOptions): Promise<void> {
        await this.user.update({
            where: {
                id: args?.id,
                email: args?.email,
            },
            data: {
                name: data.name,
                address: data.address,
            }
        })
        .catch(err => {
            Logger.error(`유저 정보 업데이트 실패`, err.toString(), UserRepository.name)  
            throw err
         })
    }
    async deleteBy(args: UserFindOptions): Promise<void> {
        await this.user.delete({
            where: {
                id: args.id,
                email: args.email,
            }
        })
        .catch(err => {
            Logger.error(`유저 정보 삭제 실패`, err.toString(), UserRepository.name) 
            throw err
         })
    }
    async create(data: UserCreateOptions): Promise<UserEntity> {
        const user = await this.user.create({
            data: {
                email: data.email,
                password: data.password,
                address: data.address,
                salt: data.salt,
                name: data.name,
            },
            include: {
                qaboards: true,
                coupons: true,
            }
        })
        .catch(err => {
            Logger.error(`유저 정보 등록 실패`, err.toString(), UserRepository.name) 
            throw err
        })
        return this.toEntity(user)
    }

    toEntity(v) : UserEntity{
        return {
            id: v.id,
            email: v.email,
            password: v.password,
            salt: v.salt,
            orders: v.orders,
            qaboards: v.qaboards as QABoardEntity[],
            coupons: v.coupons as CouponEntity[],
            address: v.address,
            basket: [...v.baskets.keys()].map(key => {
                var item = v.baskets[key]
                if(item) {
                    return {
                        productId: item['productId'],
                        productName: item['productName'],
                        price: item['price'],
                        thumbnail: item['thumbnail'],
                        counts: item['counts']
                    } as SimpleProductModel
                }
            }),
            createdAt: v.createdAt,
            isAdmin: v.isAdmin,
        } as UserEntity
    }
}