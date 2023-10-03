
import { SimpleProductModel } from "src/model/simple_product.model";
import { OrderEntity } from "./order.entity";
import { QABoardMetaEntity } from "./qaboard_meta.entity";

export interface UserEntity {
    readonly id: number
    readonly email: string
    readonly password: string
    readonly address: string
    readonly salt: string
    readonly orders: OrderEntity[]
    readonly coupons: string[]
    readonly qaboards: QABoardMetaEntity[]
    readonly basket: SimpleProductModel[] // 상품 아이디 배열
    readonly createdAt: Date
    readonly isAdmin: boolean
}