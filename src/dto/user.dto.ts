import { SimpleProductDto } from "src/dto/simple_product.dto"
import { OrderDto } from "./order.dto"
import { CouponDto } from "./coupon.dto"
import { UserEntity } from "src/entity/user.entity"
import { QABoardMetaDto } from "./qaboard_meta.dto"

export class UserDto {
    constructor(
        readonly email: string,
        readonly name: string,
        readonly address: string,
        readonly orders: OrderDto[],
        readonly coupons: CouponDto[],
        readonly qaboards: QABoardMetaDto[],
        readonly basket: SimpleProductDto[],
        readonly createdAt: Date | string,
    ){}

    static fromEntity(entity: UserEntity) : UserDto {
        return {
            email: entity.email,
            name: entity.username,
            address: entity.address,
            orders: entity.orders.map(o => OrderDto.fromEntity(o)),
            coupons: entity.coupons.map(c => CouponDto.parseCouponMetadata(c)),
            qaboards: entity.qaboards.map(qa => QABoardMetaDto.fromEntity(qa)),
            basket: entity.basket,
            createdAt: entity.createdAt,
        } as UserDto
    }
}