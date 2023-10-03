import { SimpleProductModel } from "src/model/simple_product.model"
import { OrderDto } from "./order.dto"
import { QABoardDto } from "./qaboard.dto"
import { CouponDto } from "./coupon.dto"
import { UserEntity } from "src/entity/user.entity"

export class UserDto {
    constructor(
        readonly email: string,
        readonly address: string,
        readonly orders: OrderDto[],
        readonly coupons: CouponDto[],
        readonly qaboards: QABoardDto[],
        readonly basket: SimpleProductModel[],
        readonly createdAt: Date,
    ){}

    static fromEntity(entity: UserEntity) : UserDto {
        return {
            email: entity.email,
            address: entity.address,
            orders: entity.orders.map(o => OrderDto.fromEntity(o)),
            coupons: entity.coupons.map(c => CouponDto.parseCouponMetadata(c)),
            qaboards: entity.qaboards.map(qa => QABoardDto.fromEntity(qa)),
            basket: entity.basket,
            createdAt: entity.createdAt,
        } as UserDto
    }
}