import { ICreateOptions } from "src/interface/options/icreateoptions";

export interface ProductCreateOptions extends ICreateOptions {
    readonly productName?: string
    readonly price?: number
    readonly thumbnail?: string
    readonly colors?: string[]
    readonly sizes?: string[]
    readonly images?: string[]
    readonly description?: string
}