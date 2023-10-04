import { Controller } from "@nestjs/common";
import { OrderService } from "src/services/order.service";

@Controller("user/order")
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ){}
}