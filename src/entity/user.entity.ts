
import { SimpleProductModel } from "src/model/simple_product.model";
import { QABoardEntity } from "./qaboard.entity";
import { OrderEntity } from "./order.entity";

export interface UserEntity {
    readonly id: number
    readonly email: string
    readonly password: string
    readonly address: string
    readonly salt: string
    readonly orders: OrderEntity[]
    readonly coupons: string[]
    readonly qaboards: QABoardEntity[]
    readonly basket: SimpleProductModel[] // 상품 아이디 배열
    readonly createdAt: Date
    readonly isAdmin: boolean
}