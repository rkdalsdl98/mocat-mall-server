import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { QABoardEntity } from "src/entity/qaboard.entity";
import { ICreateOptions } from "src/interface/respository/icreateoptions";
import { IFindOptions } from "src/interface/respository/ifindoptions";
import { IRepository } from "src/interface/respository/irepository";
import { IUpdateOptions } from "src/interface/respository/iupdateoptions";

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

    get?(args?: IFindOptions | undefined): Promise<QABoardEntity[]> {
        throw new Error("Method not implemented.");
    }
    getBy?(args?: IFindOptions | undefined): Promise<QABoardEntity | null | undefined> {
        throw new Error("Method not implemented.");
    }
    updateBy?(data: IUpdateOptions, args?: IFindOptions | undefined): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    deleteBy?(args?: IFindOptions | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    create?(data: ICreateOptions, args?: unknown): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    toEntity?(value: any): QABoardEntity {
        throw new Error("Method not implemented.");
    }

}