import { TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";

@Controller("product")
export class ProductController {
    // 페이징 식으로 구현 해야 함
    @TypedRoute.Get()
    async getProducts() : Promise<void> {}

    @TypedRoute.Get("byid")
    async getProductBy() : Promise<void> {}

    @TypedRoute.Post()
    async addProduct() : Promise<void> {}

    @TypedRoute.Patch()
    async updateProduct() : Promise<void> {}

    @TypedRoute.Delete()
    async deleteProduct() : Promise<void> {}
}