import { Module } from "@nestjs/common";
import { QABoardController } from "src/controllers/qaboard.controller";
import { QABoardService } from "src/services/qaboard.service";

@Module({
    controllers: [QABoardController],
    providers: [
        QABoardService,
    ],
})
export class QABoardModule {}