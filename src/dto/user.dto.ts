import { SimpleProductModel } from "src/model/simple_product.model"

export interface UserDto {
    readonly email: string
    readonly address: string
    readonly orders
    readonly coupons
    readonly qaboards
    readonly basket: SimpleProductModel[]
    readonly createdAt: Date
    readonly isAdmin: boolean
}