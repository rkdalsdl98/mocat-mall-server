import { IOptionsQuery } from "./ioptions.query";
import { tags } from "typia"

export interface IProductQuery extends IOptionsQuery {
    readonly productId?: number & tags.Type<"uint32">
}

export namespace IProductQuery {
    export interface IProductQueryUpdateOptions {}
    export interface IProductQueryDeleteOptions extends IProductQuery {}
    export interface IProductQueryCreateOptions extends IProductQuery {}
}