import { Module } from "@nestjs/common";
import { OrderController } from "src/controllers/order.controller";
import { OrderRepository } from "src/repository/order/order.repository";
import { OrderService } from "src/services/order.service";

@Module({
    providers: [
        OrderService,
        OrderRepository,
    ],
    controllers: [OrderController]
})
export class OrderModule {}