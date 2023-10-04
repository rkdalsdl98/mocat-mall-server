import { ProductDetailEntity } from "src/entity/product_detail.entity";

export class ProductDetailDto {
    constructor(
        readonly colors: string[],
        readonly sizes: string[],
        readonly images: string[],
        readonly description: string,
    ){}

    static fromEntity(entity: ProductDetailEntity) : ProductDetailDto {
        return {
            colors: entity.colors,
            sizes: entity.sizes,
            images: entity.images,
            description: entity.description,
        } as ProductDetailDto
    }
}