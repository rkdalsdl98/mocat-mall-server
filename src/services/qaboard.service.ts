import { Injectable } from "@nestjs/common";
import { QABoardRepository } from "src/repository/qaboard/qaboard.repository";
import RedisService from "./redis.service";
import { QABoardDto } from "src/dto/qaboard.dto";
import { QABoardFindOptions } from "src/repository/qaboard/qaboard_findoptions";
import { QABoardEntity } from "src/entity/qaboard.entity";
import { QABoardUpdateOptions } from "src/repository/qaboard/qaboard_updateoptions";

@Injectable()
export class QABoardService {
    constructor(
        private readonly qaboardRepository: QABoardRepository,
        private readonly redisService: RedisService,
    ){}

    async getQABoards() : Promise<QABoardDto[] | undefined> {
        const caches = await this.redisService.get<QABoardEntity[]>("qaboards", QABoardService.name)
        if(caches) return caches.map(b => QABoardDto.fromEntity(b))

        const boards = await this.qaboardRepository.get()
        if(boards) return boards.map(b => QABoardDto.fromEntity(b))

        return boards
    }

    async getQABoardBy(args: QABoardFindOptions) : Promise<QABoardDto | null | undefined> {
        const caches = await this.redisService.get<QABoardEntity[]>("qaboards", QABoardService.name)
        if(caches) {
            const cache = caches.find(b => b.id === args.boardId)
            if(cache) return QABoardDto.fromEntity(cache)
        }

        const board = await this.qaboardRepository.getBy(args)
        if(board) return QABoardDto.fromEntity(board)

        return board
    }

    async updateQABoardBy(data: QABoardUpdateOptions, args: QABoardFindOptions) : Promise<void> {
        const board = await this.qaboardRepository.updateBy(data, args)
        if(!board) throw new Error("NotFound")

        let caches = await this.redisService.get<QABoardEntity[]>("qaboards", QABoardService.name)
        if(caches) {
            caches = caches.filter(b => b.id !== board.id)
            caches.push(board)
            await this.redisService.set("qaboards", caches, QABoardService.name)
        }
    }

    async deleteQABoard(args: QABoardFindOptions) : Promise<void> {
        let caches = await this.redisService.get<QABoardEntity[]>("qaboards", QABoardService.name)
        if(caches) {
            caches = caches.filter(b => b.id !== args.boardId)
            await this.redisService.set("qaboards", caches, QABoardService.name)
        }
        return await this.qaboardRepository.deleteBy(args)
    }
}