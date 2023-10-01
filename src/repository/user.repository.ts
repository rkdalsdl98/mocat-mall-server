import { OnModuleDestroy, OnModuleInit, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { QABoardEntity } from "src/entity/qaboard.entity";
import { UserEntity } from "src/entity/user.entity";
import { SimpleProductModel } from "src/model/simple_product.model";
import { UserFindOptions } from "./user_findoptions";
import { UserUpdateOptions } from "./user_updateoptions";
import { IRepository } from "src/interface/respository/irepository";
import { UserCreateOptions } from "./user_createoptions";
import { ReplyEntity } from "src/entity/reply.entity";
import { OrderEntity } from "src/entity/order.entity";
import { DeliveryEntity } from "src/entity/delivery.entity";

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
                orders: true,
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

    async getBy(args: UserFindOptions): Promise<UserEntity | null | undefined> {
        const user = await this.user.findUnique({
            include: {
                qaboards: true,
                orders: true,
            },
            where: {
                id: args.id,
                email: args.email,
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

    async updateBy(data: UserUpdateOptions, args: UserFindOptions): Promise<UserEntity> {
        return this.toEntity(await this.user.update({
            where: {
                id: args.id,
                email: args.email,
            },
            data: {
                name: data.name,
                address: data.address,
            },
            include: {
                qaboards: true,
                orders: true,
            }
        })
        .catch(err => {
            Logger.error(`유저 정보 업데이트 실패`, err.toString(), UserRepository.name)  
            throw err
         }))
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
    
    async create(data: UserCreateOptions, salt: string): Promise<UserEntity> {
        const user = await this.user.create({
            data: {
                email: data.email!,
                password: data.password!,
                address: data.address!,
                salt: salt,
                name: data.name!,
            },
            include: {
                qaboards: true,
                orders: true,
            }
        })
        .catch(err => {
            Logger.error(`유저 정보 등록 실패`, err.toString(), UserRepository.name) 
            throw err
        })
        return this.toEntity(user)
    }

    async connectCoupon(coupon : string, args: UserFindOptions) : Promise<UserEntity> {
        return this.toEntity(await this.user.update({
            where: { email: args.email },
            data: {
                coupons: { push: coupon }
            },
            include: {
                qaboards: true,
                orders: true,
            }
        })
        .catch(err => {
            Logger.error(`쿠폰 등록 실패`, err.toString(), UserRepository.name) 
            throw err
        }))
    }

    // 필터 타입으로 교체
    toEntity(v) : UserEntity{
        return {
            id: v.id,
            email: v.email,
            password: v.password,
            salt: v.salt,
            orders: [...Object.keys(v.orders)].map(key => {
                var item = v.orders[key]
                if(item) {
                    return {
                        orderId: item['orderId'],
                        paymentKey: item['paymentKey'],
                        delivery: {
                            id: item['delivery']['id'],
                            orderId: item['delivery']['orderId'],
                            address: item['delivery']['address'],
                            detailAddress: item['delivery']['detailAddress'],
                            memo: item['delivery']['memo'],
                            state: item['delivery']['state'],
                            products: [...Object.keys(item['delivery']['products'])].map(key => {
                                var product = item['delivery']['products'][key]
                                if(product) {
                                    return {
                                        productId: product['productId'],
                                        productName: product['productName'],
                                        thumbnail: product['thumbnail'],
                                        counts: product['counts'],
                                        price: product['price'],
                                    } as SimpleProductModel
                                }
                            })
                        } as DeliveryEntity,
                        userId: item['userId'],
                    } as OrderEntity
                }
            }),
            qaboards: [...Object.keys(v.qaboards)].map(key => {
                var item = v.qaboards[key]
                if(item) {
                    return {
                        id: item['id'],
                        title: item['title'],
                        contentText: item['contentText'],
                        productId: item['productId'] ?? undefined,
                        visited: item['visited'],
                        writerEmail: item['writerEmail'],
                        writerName: item['writerName'],
                        reply: [...Object.keys(item['reply'])].map(key => {
                            var item = item['reply'][key]
                            if(item) {
                                return {
                                    id: item['id'],
                                    contentText: item['contentText'],
                                    writerEmail: item['writerEmail'],
                                    writerName: item['writerName'],
                                    boardId: item['boardId'],
                                } as ReplyEntity
                            }
                        }),
                        userId: item['userId'],
                        createdAt: item['createdAt'],
                        updatedAt: item['updatedAt'],
                    } as QABoardEntity
                }
            }),
            coupons: v.coupons,
            address: v.address,
            basket: [...Object.keys(v.baskets)].map(key => {
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