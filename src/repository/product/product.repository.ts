import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ProductEntity } from "src/entity/product.entity";
import { ICreateOptions } from "src/interface/options/icreateoptions";
import { IFindOptions } from "src/interface/options/ifindoptions";
import { IUpdateOptions } from "src/interface/options/iupdateoptions";

import { IRepository } from "src/interface/respository/irepository";

@Injectable()
export class ProductRepository extends PrismaClient implements IRepository<ProductEntity>, OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect()
        .then(_=> Logger.log("Connected database server.", ProductRepository.name))
        .catch(err => Logger.error(`Failed connected database server.`, err, ProductRepository.name))
    }
    
    async onModuleDestroy() {
        await this.$disconnect()
        .then(_ => Logger.log("Disconnected database server.", ProductRepository.name))
        .catch(err => Logger.error(`Cannot disconnected database server.`, err, ProductRepository.name))
    }
    get?(args?: IFindOptions | undefined): Promise<ProductEntity[]> {
        throw new Error("Method not implemented.");
    }
    getBy?(args?: IFindOptions | undefined): Promise<ProductEntity | null | undefined> {
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
    toEntity?(value: any): ProductEntity {
        throw new Error("Method not implemented.");
    }
}