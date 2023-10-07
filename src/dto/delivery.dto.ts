import { DeliveryEntity } from "src/entity/delivery.entity"
import { SimpleProductDto } from "src/dto/simple_product.dto"

export class DeliveryDto {
    constructor(
        readonly orderId: string,
        readonly address: string,
        readonly detailAddress: string,
        readonly memo: string,
        readonly products: SimpleProductDto[],
    ){}

    static fromEntity(entity: DeliveryEntity) : DeliveryDto {
        return {
            orderId: entity.orderId,
            address: entity.address,
            detailAddress: entity.detailAddress,
            memo: entity.memo,
            products: entity.products,
        } as DeliveryDto
    }
} 