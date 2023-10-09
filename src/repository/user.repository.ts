import { OnModuleDestroy, OnModuleInit, Logger, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { UserEntity } from "src/entity/user.entity";
import { SimpleProductDto } from "src/dto/simple_product.dto";
import { UserFindOptions } from "./user_findoptions";
import { UserUpdateOptions } from "./user_updateoptions";
import { IRepository } from "src/interface/respository/irepository";
import { UserCreateOptions } from "./user_createoptions";
import { OrderEntity } from "src/entity/order.entity";
import { DeliveryEntity } from "src/entity/delivery.entity";
import { QABoardMetaEntity } from "src/entity/qaboard_meta.entity";
import { ERROR } from "src/common/form/response.form";
import { AuthorityEntity } from "src/entity/authority.entity";

@Injectable()
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
                orders: true,
                authority: true,
            },
            where: {
                id: args?.id,
                email: args?.email,
            }
        })
        .catch(err => { 
            Logger.error(`유저 정보 조회 실패`, err.toString(), UserRepository.name) 
            throw typeof ERROR.ServerDatabaseError 
        }))
        .map(e => {
            return this.toEntity(e)
        })
    }

    async getBy(args: UserFindOptions): Promise<UserEntity | null | undefined> {
        const user = await this.user.findUnique({
            include: {
                orders: true,
                authority: true,
            },
            where: {
                id: args.id,
                email: args.email,
            }
        })
        .catch(err => { 
            Logger.error(`유저 정보 조회 실패`, err.toString(), UserRepository.name) 
            throw typeof ERROR.ServerDatabaseError 
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
                username: data.name,
                address: data.address,
            },
            include: {
                orders: true,
            }
        })
        .catch(err => {
            Logger.error(`유저 정보 업데이트 실패`, err.toString(), UserRepository.name)  
            throw typeof ERROR.ServerDatabaseError 
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
            throw typeof ERROR.ServerDatabaseError 
         })
    }
    
    async create(data: UserCreateOptions, salt: string): Promise<UserEntity> {
        const user = await this.user.create({
            data: {
                email: data.email,
                password: data.password,
                address: data.address,
                salt: salt,
                username: data.name,
            },
            include: {
                orders: true,
            }
        })
        .catch(err => {
            Logger.error(`유저 정보 등록 실패`, err.toString(), UserRepository.name) 
            throw typeof ERROR.ServerDatabaseError 
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
                orders: true,
            }
        })
        .catch(err => {
            Logger.error(`쿠폰 등록 실패`, err.toString(), UserRepository.name) 
            throw typeof ERROR.ServerDatabaseError 
        }))
    }

    // 필터 타입으로 교체
    toEntity(v) : UserEntity{
        return {
            id: v.id,
            email: v.email,
            password: v.password,
            username: v.username,
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
                                    } as SimpleProductDto
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
                        boardId: item['id'],
                        title: item['title'],
                        contentText: item['contentText'],
                        productId: item['productId'] ?? undefined,
                        visited: item['visited'], 
                        createdAt: item['createdAt'],
                    } as QABoardMetaEntity
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
                    } as SimpleProductDto
                }
            }),
            createdAt: v.createdAt,
            authority: v.authority,
        } as UserEntity
    }
}