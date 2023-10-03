import { Injectable } from "@nestjs/common";
import { QABoardRepository } from "src/repository/qaboard/qaboard.repository";
import RedisService from "./redis.service";

@Injectable()
export class QABoardService {
    constructor(
        private readonly qaboardRepository: QABoardRepository,
        private readonly redisService: RedisService,
    ){}
}