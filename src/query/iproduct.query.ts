import { IOptionsQuery } from "./ioptions.query";
import { tags } from "typia"

export interface IProductQuery extends IOptionsQuery {
    readonly productId?: number & tags.Type<"uint32">
}

export namespace IProductQuery {
    export interface IProductQueryDeleteOptions extends IProductQuery {}
    export interface IProductQueryUpdateOrCreateOptions extends IProductQuery {
        readonly productName?: string & tags.MaxLength<20>
        readonly price?: number & tags.Type<"uint32">
        readonly thumbnail?: string & tags.Format<"url">
        readonly colors?: string[]
        readonly sizes?: string[]
        readonly images?: string[]
        readonly descriptions: string & tags.MaxLength<200>
    }
}