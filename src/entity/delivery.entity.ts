import { SimpleProductModel } from "src/model/simple_product.model"

export interface DeliveryEntity {
    readonly id: number
    readonly orderId: string
    readonly address: string
    readonly detailAddress: string
    readonly memo: string
    readonly state: string
    readonly products: SimpleProductModel[] // 상품 아이디 배열
}