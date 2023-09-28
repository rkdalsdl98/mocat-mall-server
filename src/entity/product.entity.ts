import { ProductDetailEntity } from "./product_detail.entity"

export interface ProductEntity {
    readonly id: number
    readonly productName: string
    readonly price: number
    readonly thumbnail: string
    readonly productDetail: ProductDetailEntity
}