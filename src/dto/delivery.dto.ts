import { DeliveryEntity } from "src/entity/delivery.entity"
import { SimpleProductModel } from "src/model/simple_product.model"

export class DeliveryDto {
    constructor(
        readonly orderId: string,
        readonly address: string,
        readonly detailAddress: string,
        readonly memo: string,
        readonly products: SimpleProductModel[],
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