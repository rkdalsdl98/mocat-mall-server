import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { QABoardEntity } from "src/entity/qaboard.entity";
import { IRepository } from "src/interface/respository/irepository";
import { QABoardFindOptions } from "./qaboard_findoptions";
import { ReplyEntity } from "src/entity/reply.entity";
import { QABoardUpdateOptions } from "./qaboard_updateoptions";
import { QABoardCreateOptions } from "./qaboard_createoptions";
import { ERROR } from "src/common/form/response.form";

@Injectable()
export class QABoardRepository extends PrismaClient implements IRepository<QABoardEntity>, OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect()
        .then(_=> Logger.log("Connected database server.", QABoardRepository.name))
        .catch(err => Logger.error(`Failed connected database server.`, err, QABoardRepository.name))
    }
    
    async onModuleDestroy() {
        await this.$disconnect()
        .then(_ => Logger.log("Disconnected database server.", QABoardRepository.name))
        .catch(err => Logger.error(`Cannot disconnected database server.`, err, QABoardRepository.name))
    }

    async get(args?: QABoardFindOptions): Promise<QABoardEntity[]> {
        return (await this.qaboard.findMany({ include: { reply: true }})
        .catch(err => {
            Logger.error(`게시글 조회 실패`, err.toString(), QABoardRepository.name) 
            throw typeof ERROR.ServerDatabaseError 
        }))
        .map(e => this.toEntity(e))
    }
    async getBy(args: QABoardFindOptions): Promise<QABoardEntity | null | undefined> {
        const board = await this.qaboard.findUnique({
            include: { reply: true }, 
            where: { id: args.boardId }
        })
        .catch(err => {
            Logger.error(`게시글 조회 실패`, err.toString(), QABoardRepository.name) 
            throw typeof ERROR.ServerDatabaseError 
        })

        if(board) this.toEntity(board)
        return board
    }
    async updateBy(data: QABoardUpdateOptions, args: QABoardFindOptions): Promise<QABoardEntity | undefined> {
        return this.toEntity(await this.qaboard.update({
            where: { id: args.boardId },
            data: {
                title: data.title,
                productId: data.productId,
                contentText: data.contentText,
            },
            include: { reply: true }
        })
        .catch(err => {
            Logger.error(`게시글 갱신 실패`, err.toString(), QABoardRepository.name) 
            throw err
        }))
    }
    async deleteBy(args: QABoardFindOptions): Promise<void> {
        await this.qaboard.delete({ where: { id: args.boardId } })
        .catch(err => {
            Logger.error(`게시글 삭제 실패`, err.toString(), QABoardRepository.name) 
            throw typeof ERROR.ServerDatabaseError 
        })
    }

    // 유저 릴레이션 끊으면 오류 안뜸
    // async create(data: QABoardCreateOptions, args?: unknown): Promise<unknown> {
    //     return await this.qaboard.create({
    //         data: {
    //             title: data.title,
    //             contentText: data.contentText,
    //             writerEmail: data.writerEmail,
    //             writerName: data.writerName,
    //         }
    //     })
    // }
    toEntity(v): QABoardEntity {
        return {
            id: v.id,
            title: v.title,
            contentText: v.contentText,
            productId: v.productId,
            visited: v.visited,
            writerEmail: v.writerEmail,
            writerName: v.writerName,
            reply: [...Object.keys(v.reply)].map(key => {
                var item = v.reply[key]
                if(item) {
                    return {
                        id: item['id'],
                        contentText: item['contentText'],
                        writerEmail: item['writerEmail'],
                        writerName: item['writerName'],
                        boardId: item['boardId'],
                    } as ReplyEntity
                }
            }),
            createdAt: v.createdAt,
            updatedAt: v.updatedAt,
        } as QABoardEntity
    }

}