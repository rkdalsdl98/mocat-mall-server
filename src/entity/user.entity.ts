import { BasketItemModel } from "src/model/simple_product.model";
import { CouponEntity } from "./coupon.entity";
import { QABoardEntity } from "./qaboard.entity";

export interface UserEntity {
    readonly id: number,
    readonly email: string,
    readonly password: string
    readonly address: string
    readonly salt: string,
    readonly orders: string[],
    readonly coupons: CouponEntity[],
    readonly qaboards: QABoardEntity[],
    readonly basket: BasketItemModel[], // 상품 아이디 배열
    readonly createdAt: Date,
    readonly isAdmin: boolean
}