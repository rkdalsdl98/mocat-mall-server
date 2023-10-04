import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ProductEntity } from "src/entity/product.entity";
import { ProductDetailEntity } from "src/entity/product_detail.entity";
import { IRepository } from "src/interface/respository/irepository";
import { ProductFindOptions } from "./product_findoptions";
import { ProductUpdateOptions } from "./product_updateoptions";
import { ProductCreateOptions } from "./product_createoptions";

@Injectable()
export class ProductRepository extends PrismaClient implements IRepository<ProductEntity>, OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect()
        .then(_=> Logger.log("Connected database server.", ProductRepository.name))
        .catch(err => Logger.error(`Failed connected database server.`, err, ProductRepository.name))
    }
    
    async onModuleDestroy() {
        await this.$disconnect()
        .then(_ => Logger.log("Disconnected database server.", ProductRepository.name))
        .catch(err => Logger.error(`Cannot disconnected database server.`, err, ProductRepository.name))
    }

    async get(args?: ProductFindOptions): Promise<ProductEntity[]> {
        return (await this.product.findMany({ include: { productDetail: true }})
        .catch(err => {
            Logger.error(`상품 조회 실패`, err.toString(), ProductRepository.name) 
            throw err
        }))
        .map(e => this.toEntity(e))
    }

    async getBy(args: ProductFindOptions): Promise<ProductEntity | null | undefined> {
        return this.toEntity(await this.product.findUnique({ 
            where:{ id: args.productId },
            include: { productDetail: true }
        })
        .catch(err => {
            Logger.error(`상품 조회 실패`, err.toString(), ProductRepository.name) 
            throw err
        }))
    }

    async updateBy(data: ProductUpdateOptions, args: ProductFindOptions): Promise<ProductEntity> {
        return this.toEntity(await this.product.update({ 
            where: { id: args.productId },
            data: {
                productName: data.productName,
                price: data.price,
                thumbnail: data.thumbnail,
                productDetail: {
                    update: {
                        data: {
                            colors: data.colors,
                            sizes: data.sizes,
                            images: data.images,
                            description: data.description,
                        }
                    }
                }
            },
            include: { productDetail: true }
        })
        .catch(err => {
            Logger.error(`상품 갱신 실패`, err.toString(), ProductRepository.name) 
            throw err
        }))
    }

    async deleteBy(args: ProductFindOptions): Promise<void> {
        await this.product.delete({ where: { id: args.productId } })
    }

    async create(data: ProductCreateOptions, args?: unknown): Promise<ProductEntity> {
        return this.toEntity(await this.product.create({
            data: {
                productName: data.productName ?? "상품이름이 누락되었습니다.",
                price: data.price,
                thumbnail: data.thumbnail,
                productDetail: {
                    create: {
                        colors: data.colors,
                        sizes: data.sizes,
                        images: data.images,
                        description: data.description ?? "상품설명이 없습니다.",
                    }
                }
            }
        })
        .catch(err => {
            Logger.error(`상품 등록 실패`, err.toString(), ProductRepository.name) 
            throw err
        }))
    }

    toEntity(v): ProductEntity {
        return {
            id: v.id,
            productName: v.productName,
            productDetail: {
                id: v.productDetail.id,
                productId: v.product_detail.productId,
                colors: v.productDetail.colors,
                sizes: v.productDetail.sizes,
                images: v.productDetail.images,
                description: v.productDetail.description,
            } as ProductDetailEntity,
            price: v.price,
            thumbnail: v.thumbnail,
        } as ProductEntity
    }
}