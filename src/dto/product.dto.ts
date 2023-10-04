import { ProductEntity } from "src/entity/product.entity";
import { ProductDetailDto } from "./product_detail.dto"

export class ProductDto {
    constructor(
        readonly productName: string,
        readonly price: number,
        readonly thumbnail: string,
        readonly detail: ProductDetailDto,
    ){}

    static fromEntity(entity: ProductEntity) : ProductDto {
        return {
            productName: entity.productName,
            price: entity.price,
            thumbnail: entity.thumbnail,
            detail: ProductDetailDto.fromEntity(entity.productDetail),
        } as ProductDto
    }
}