import { TypedQuery, TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ProductDto } from "src/dto/product.dto";
import { IProductQuery } from "src/query/iproduct.query";
import { ProductService } from "src/services/product.service";

@Controller("product")
@ApiTags("상품")
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ){}

    // 페이징 식으로 구현 해야 함
    /**
     * 상품 리스트 불러오기
     * 
     * @returns 상품 리스트
     */
    @TypedRoute.Get()
    async getProducts() : Promise<ProductDto[]> {
        return await this.productService.getProducts()
    }

    /**
     * 상품 불러오기
     * 
     * @returns 상품
     */
    @TypedRoute.Get("byid")
    async getProductBy(
        @TypedQuery() query: IProductQuery
    ) : Promise<ProductDto | undefined | null> {
        return await this.productService.getProductBy({ productId: query.productId })
    }

    /**
     * 상품 등록
     * 
     * 권한이 있는 사람만 가능
     */
    @TypedRoute.Post()
    async addProduct(
        @TypedQuery() query: IProductQuery.IProductQueryUpdateOrCreateOptions
    ) : Promise<void> {
        return await this.productService.addProduct({
            price: query.price,
            productName: query.productName,
            thumbnail: query.thumbnail,
            colors: query.colors,
            sizes: query.sizes,
            images: query.images,
            description: query.descriptions,
        })
    }

    /**
     * 상품 갱신
     * 
     * 권한이 있는 사람만 가능
     */
    @TypedRoute.Patch()
    async updateProduct(
        @TypedQuery() query: IProductQuery.IProductQueryUpdateOrCreateOptions
    ) : Promise<void> {
        return await this.productService.updateProduct({
            price: query.price,
            productName: query.productName,
            thumbnail: query.thumbnail,
            colors: query.colors,
            sizes: query.sizes,
            images: query.images,
            description: query.descriptions,
        }, { productId: query.productId })
    }

    /**
     * 상품 삭제
     * 
     * 권한이 있는 사람만 가능
     */
    @TypedRoute.Delete()
    async deleteProduct(
        @TypedQuery() query: IProductQuery.IProductQueryDeleteOptions
    ) : Promise<void> {
        return await this.productService.deleteProduct({ productId: query.productId })
    }
}