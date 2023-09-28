import { DeliveryEntity } from "./delivery.entity"

export interface OrderEntity {
    readonly orderId: string
    readonly paymentKey: string
    readonly delivery: DeliveryEntity
    readonly userId: number
}