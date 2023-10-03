import { Injectable } from "@nestjs/common";
import { ProductRepository } from "src/repository/product/product.repository";
import RedisService from "./redis.service";

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly redisService: RedisService,
    ){}

    async getProducts() : Promise<void> {}
    async getProductBy() : Promise<void> {}
    async addProduct() : Promise<void> {}
    async updateProduct() : Promise<void> {}
    async deleteProduct() : Promise<void> {}
}