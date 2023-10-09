
import { SimpleProductDto } from "src/dto/simple_product.dto";
import { OrderEntity } from "./order.entity";
import { QABoardMetaEntity } from "./qaboard_meta.entity";
import { AuthorityEntity } from "./authority.entity";

export interface UserEntity {
    readonly id: number
    readonly email: string
    readonly username: string
    readonly password: string
    readonly address: string
    readonly salt: string
    readonly orders: OrderEntity[]
    readonly coupons: string[]
    readonly qaboards: QABoardMetaEntity[]
    readonly basket: SimpleProductDto[] // 상품 아이디 배열
    readonly createdAt: Date
    readonly authority: AuthorityEntity | null
}