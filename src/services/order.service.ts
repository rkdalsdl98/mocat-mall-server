import { Injectable } from "@nestjs/common";
import { OrderRepository } from "src/repository/order/order.repository";
import RedisService from "./redis.service";

@Injectable()
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly redisService: RedisService,
    ) {}
}