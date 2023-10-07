import { SimpleProductDto } from "src/dto/simple_product.dto"

export interface DeliveryEntity {
    readonly id: number
    readonly orderId: string
    readonly address: string
    readonly detailAddress: string
    readonly memo: string
    readonly state: string
    readonly products: SimpleProductDto[] // 상품 아이디 배열
}