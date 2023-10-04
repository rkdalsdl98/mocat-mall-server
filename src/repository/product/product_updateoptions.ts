import { IUpdateOptions } from "src/interface/options/iupdateoptions";

export interface ProductUpdateOptions extends IUpdateOptions {
    readonly productName?: string
    readonly price?: number
    readonly thumbnail?: string
    readonly colors?: string[]
    readonly sizes?: string[]
    readonly images?: string[]
    readonly description?: string
}