import { Module } from "@nestjs/common";
import { QABoardController } from "src/controllers/qaboard.controller";
import { QABoardRepository } from "src/repository/qaboard/qaboard.repository";
import { QABoardService } from "src/services/qaboard.service";
import RedisService from "src/services/redis.service";
import { AuthModule } from "./auth.module";
import { AuthService } from "src/services/auth.service";

@Module({
    imports: [AuthModule],
    controllers: [QABoardController],
    providers: [
        QABoardService,
        QABoardRepository,
        RedisService,
        AuthService,
    ],
})
export class QABoardModule {}