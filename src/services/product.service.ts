import { Injectable } from "@nestjs/common";
import { ProductRepository } from "src/repository/product/product.repository";
import RedisService from "./redis.service";
import { ProductDto } from "src/dto/product.dto";
import { ProductEntity } from "src/entity/product.entity";
import { ProductFindOptions } from "src/repository/product/product_findoptions";
import { ProductCreateOptions } from "src/repository/product/product_createoptions";
import { ProductUpdateOptions } from "src/repository/product/product_updateoptions";

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly redisService: RedisService,
    ){}

    async getProducts() : Promise<ProductDto[] | never> {
        const caches = await this.redisService.get<ProductEntity[]>("products", ProductService.name)
        if(caches) return caches.map(p => ProductDto.fromEntity(p))

        const entites = await this.productRepository.get()
        return entites.map(p => ProductDto.fromEntity(p))
    }

    async getProductBy(args: ProductFindOptions) : Promise<ProductDto | undefined | null> {
        const caches = await this.redisService.get<ProductEntity[]>("products", ProductService.name)
        if(caches) {
            const cache = caches.find(p => p.id === args.productId)
            if(cache) return ProductDto.fromEntity(cache)
        }
        
        const entity = await this.productRepository.getBy(args)
        if(entity) return ProductDto.fromEntity(entity)

        return entity
    }

    // 권한이있는 사람만 상품 등록 가능
    async addProduct(data: ProductCreateOptions, args?: unknown) : Promise<void> {
        const entity = await this.productRepository.create(data, args)
        let caches = await this.redisService.get<ProductEntity[]>("products", ProductService.name)
        if(caches) {
            caches.push(entity)
            await this.redisService.set("products", caches, ProductService.name)
        }
    }

    // 권한이있는 사람만 상품 갱신 가능
    async updateProduct(data: ProductUpdateOptions, args: ProductFindOptions) : Promise<void> {
        const entity = await this.productRepository.updateBy(data, args)
        let caches = await this.redisService.get<ProductEntity[]>("products", ProductService.name)
        if(caches) {
            caches = caches.filter(p => p.id !== entity.id)
            caches.push(entity)
            await this.redisService.set("products", caches, ProductService.name)
        }
    }

    // 권한이있는 사람만 상품 삭제 가능
    async deleteProduct(args: ProductFindOptions) : Promise<void> {
        let caches = await this.redisService.get<ProductEntity[]>("products", ProductService.name)
        if(caches) {
            caches = caches.filter(p => p.id !== args.productId)
            await this.redisService.set("products", caches, ProductService.name)
        }
        return await this.productRepository.deleteBy(args)
    }
}