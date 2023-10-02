import { OrderEntity } from "src/entity/order.entity"
import { DeliveryDto } from "./delivery.dto"

export class OrderDto {
    constructor(
        readonly orderId: string,
        readonly paymentKey: string,
        readonly delivery: DeliveryDto,
    ){}

    static fromEntity(entity: OrderEntity) : OrderDto {
        return {
            orderId: entity.orderId,
            paymentKey: entity.paymentKey,
            delivery: DeliveryDto.fromEntity(entity.delivery),
        } as OrderDto
    }
}