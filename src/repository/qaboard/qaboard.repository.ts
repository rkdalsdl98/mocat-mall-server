import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { QABoardEntity } from "src/entity/qaboard.entity";
import { IRepository } from "src/interface/respository/irepository";
import { QABoardFindOptions } from "./qaboard_findoptions";
import { ReplyEntity } from "src/entity/reply.entity";
import { QABoardUpdateOptions } from "./qaboard_updateoptions";
import { ERROR } from "src/common/form/response.form";
import { AssignQAProduct } from "src/entity/assign_qaproduct.entity";
import { QABoardCreateOptions } from "./qaboard_createoptions";

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
        return (await this.qaboard.findMany({ include: { reply: true, assignProduct: { include: { product: true } }} })
        .catch(err => {
            Logger.error(`게시글 조회 실패`, err.toString(), QABoardRepository.name) 
            throw ERROR.ServerDatabaseError 
        }))
        .map(e => this.toEntity(e))
    }
    async getBy(args: QABoardFindOptions): Promise<QABoardEntity | null | undefined> {
        const board = await this.qaboard.findUnique({
            include: { reply: true, assignProduct: { include: { product: true } } }, 
            where: { id: args.boardId }
        })
        .catch(err => {
            Logger.error(`게시글 조회 실패`, err.toString(), QABoardRepository.name) 
            throw ERROR.ServerDatabaseError 
        })

        if(board) this.toEntity(board)
        return board
    }
    async updateBy(data: QABoardUpdateOptions, args: Object): Promise<QABoardEntity | undefined> {
        return this.toEntity(await this.qaboard.update({
            where: { id: args['boardId'], writerEmail: args['email'] },
            data: {
                title: data.title,
                contentText: data.contentText,
            },
            include: { reply: true }
        })
        .catch(err => {
            Logger.error(`게시글 갱신 실패`, err.toString(), QABoardRepository.name) 
            if(err instanceof Prisma.PrismaClientKnownRequestError) {
                if(err.code === "P2025") throw ERROR.NotFoundData
            }
            throw ERROR.ServerDatabaseError 
        }))
    }
    async deleteBy(args: Object): Promise<void> {
        let where = { id: args['boardId'] }
        if(!("auth" in args)) where['wrtierEmail'] = args['email']

        await this.qaboard.delete({ where })
        .catch(err => {
            Logger.error(`게시글 삭제 실패`, err.toString(), QABoardRepository.name) 
            if(err instanceof Prisma.PrismaClientKnownRequestError) {
                if(err.code === "P2025") throw ERROR.NotFoundData
            }
            throw ERROR.ServerDatabaseError 
        })
    }

    async create(data: QABoardCreateOptions, args?: unknown): Promise<QABoardEntity> {
        return this.toEntity(await this.qaboard.create({
            data: {
                title: data.title,
                contentText: data.contentText,
                writerEmail: data.writerEmail,
                writerName: data.writerName,
                assignProduct: {
                    create: data.productIds.map(id => {
                        return { productId: id }
                    })
                }
            }
        })
        .catch(err => {
            Logger.error(`게시글 삭제 실패`, err.toString(), QABoardRepository.name) 
            throw ERROR.ServerDatabaseError
        }))
    }
    toEntity(v): QABoardEntity {
        return {
            id: v.id,
            title: v.title,
            contentText: v.contentText,
            productId: v.productId,
            answerState: v.answerState,
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
            assignproduct: v.assignproduct !== null 
            ? {
                productId: v.assignproduct['product']['productId'],
                productName: v.assignproduct['product']['productName'],
                price: v.assignproduct['product']['price'],
                thumbnail: v.assignproduct['product']['thumbnail'],
            } as AssignQAProduct
            : undefined,
            createdAt: v.createdAt,
        } as QABoardEntity
    }

}