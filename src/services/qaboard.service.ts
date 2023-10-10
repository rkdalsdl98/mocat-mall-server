import { Injectable, Logger } from "@nestjs/common";
import { QABoardRepository } from "src/repository/qaboard/qaboard.repository";
import RedisService from "./redis.service";
import { QABoardDto } from "src/dto/qaboard.dto";
import { QABoardFindOptions } from "src/repository/qaboard/qaboard_findoptions";
import { QABoardEntity } from "src/entity/qaboard.entity";
import { QABoardUpdateOptions } from "src/repository/qaboard/qaboard_updateoptions";
import { ERROR, TryCatch } from "src/common/form/response.form";
import { IPayload } from "src/interface/jwt/ipayload";
import { UserEntity } from "src/entity/user.entity";
import { AuthService } from "./auth.service";
import { QABoardCreateOptions } from "src/repository/qaboard/qaboard_createoptions";

@Injectable()
export class QABoardService {
    constructor(
        private readonly qaboardRepository: QABoardRepository,
        private readonly authService: AuthService,
        private readonly redisService: RedisService,
    ){this.initialized()}
    
    async initialized() : Promise<void> {
        const qas = await this.qaboardRepository.get()
        await this.redisService.set("qaboards", qas, QABoardService.name)
        .then(_=> Logger.log("질문글 캐시 동기화", QABoardService.name))
    }

    async getQABoards() : Promise<TryCatch<
    | QABoardDto[]
    | never
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.ServerCacheError
    >> {
        try{
            const caches = await this.redisService.get<QABoardEntity[]>("qaboards", QABoardService.name)
            if(caches) return { statuscode: 200, data: caches.map(b => QABoardDto.fromEntity(b)) }

            const boards = await this.qaboardRepository.get()
            if(boards) return { statuscode: 200, data: boards.map(b => QABoardDto.fromEntity(b)) }
            return { statuscode: 203, data: boards }
        } catch(e) { return e } 
    }

    async getQABoardBy(args: QABoardFindOptions) : Promise<TryCatch<
    | QABoardDto
    | null
    | undefined
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.ServerCacheError
    >> {
        try{
            const caches = await this.redisService.get<QABoardEntity[]>("qaboards", QABoardService.name)
            if(caches) {
                const cache = caches.find(b => b.id === args.boardId)
                if(cache) return { statuscode: 200, data: QABoardDto.fromEntity(cache) }
            }

            const board = await this.qaboardRepository.getBy(args)
            if(board) return { statuscode: 200, data: QABoardDto.fromEntity(board) }

            return { statuscode: 200, data: board }
        } catch(e) { return e }
    }

    async createQABoard(data: QABoardCreateOptions) : Promise<TryCatch<
    boolean
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.ServiceUnavailableException
    | typeof ERROR.UnAuthorized
    >> {
        try{
            const qaboard = await this.qaboardRepository.create(data)
            const caches = await this.redisService.get<QABoardEntity[]>("qaboards", QABoardService.name) ?? []
            caches.push(qaboard)
            await this.redisService.set("qaboards", caches, QABoardService.name)
            return { statuscode: 200, data: true }
        } catch(e) { return e }
    }

    async updateQABoardBy(data: QABoardUpdateOptions, args: QABoardFindOptions, payload: Object) : Promise<TryCatch<
    boolean
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.ServiceUnavailableException
    | typeof ERROR.UnAuthorized
    >> {
        try{
            const { email } = payload as IPayload.IPayloadByUser
            const board = await this.qaboardRepository.updateBy(data, { boardId: args.boardId, email })
            if(!board) throw new Error("NotFound")

            let caches = await this.redisService.get<QABoardEntity[]>("qaboards", QABoardService.name)
            if(caches) {
                caches = caches.filter(b => b.id !== board.id)
                caches.push(board)
                await this.redisService.set("qaboards", caches, QABoardService.name)
            }
            return { statuscode: 200, data: true }
        } catch(e) { return e }
    }

    async deleteQABoard(args: QABoardFindOptions, payload: Object) : Promise<TryCatch<
    boolean
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.ServiceUnavailableException
    | typeof ERROR.UnAuthorized
    >> {
        try{
            let resArgs : Object = { ...args }
            if("auth" in payload) {
                const employeePayload = {
                    email: payload['email'],
                    code: (payload['auth'] as Object)['code'],
                    authority: (payload['auth'] as Object)['authority']
                } as IPayload.IPayloadEmployee
                const users = await this.redisService.get<UserEntity[]>("users", QABoardService.name)
                if(!users) return ERROR.ServiceUnavailableException
                const employee = users.find(u => u.email === employeePayload.email)
                const check = this.authService.checkAuthority(employee, employeePayload)
                if(!check) return ERROR.UnAuthorized
                resArgs['auth'] = true
            }
            await this.qaboardRepository.deleteBy(resArgs)
            let caches = await this.redisService.get<QABoardEntity[]>("qaboards", QABoardService.name)
            if(caches) {
                caches = caches.filter(b => b.id !== args.boardId)
                await this.redisService.set("qaboards", caches, QABoardService.name)
            }
            return { statuscode: 200, data: true }
        } catch(e) { return e }
    }
}