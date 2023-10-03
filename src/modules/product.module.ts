import { Module } from "@nestjs/common";
import { ProductController } from "src/controllers/product.controller";
import { ProductRepository } from "src/repository/product/product.repository";
import { ProductService } from "src/services/product.service";
import RedisService from "src/services/redis.service";

@Module({
    providers: [
        ProductService,
        ProductRepository,
        RedisService,
    ],
    controllers: [ProductController],
})
export class ProductModule {}