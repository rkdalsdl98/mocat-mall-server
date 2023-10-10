import { Module } from "@nestjs/common";
import { ProductController } from "src/controllers/product.controller";
import { ProductRepository } from "src/repository/product/product.repository";
import { ProductService } from "src/services/product.service";
import RedisService from "src/services/redis.service";
import { AuthModule } from "./auth.module";
import { AuthService } from "src/services/auth.service";

@Module({
    imports: [AuthModule],
    providers: [
        ProductService,
        ProductRepository,
        RedisService,
        AuthService,
    ],
    controllers: [ProductController],
})
export class ProductModule {}