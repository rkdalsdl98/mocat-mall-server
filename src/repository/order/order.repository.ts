import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { OrderEntity } from "src/entity/order.entity";
import { ICreateOptions } from "src/interface/options/icreateoptions";
import { IFindOptions } from "src/interface/options/ifindoptions";
import { IUpdateOptions } from "src/interface/options/iupdateoptions";
import { IRepository } from "src/interface/respository/irepository";

@Injectable()
export class OrderRepository extends PrismaClient implements IRepository<OrderEntity>, OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect()
        .then(_=> Logger.log("Connected database server.", OrderRepository.name))
        .catch(err => Logger.error(`Failed connected database server.`, err, OrderRepository.name))
    }
    
    async onModuleDestroy() {
        await this.$disconnect()
        .then(_ => Logger.log("Disconnected database server.", OrderRepository.name))
        .catch(err => Logger.error(`Cannot disconnected database server.`, err, OrderRepository.name))
    }
    
    async get(args?: IFindOptions | undefined): Promise<OrderEntity[]> {
        throw new Error("Method not implemented.");
    }
    async getBy(args?: IFindOptions | undefined): Promise<OrderEntity | null | undefined> {
        throw new Error("Method not implemented.");
    }
    async updateBy(data: IUpdateOptions, args?: IFindOptions | undefined): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    async deleteBy(args?: IFindOptions | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async create(data: ICreateOptions, args?: unknown): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    toEntity(value: any): OrderEntity | null | undefined {
        throw new Error("Method not implemented.");
    }

}