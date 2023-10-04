import { IUpdateOptions } from "src/interface/options/iupdateoptions"

export interface QABoardUpdateOptions extends IUpdateOptions {
    readonly title?: string
    readonly productId?: number
    readonly contentText?: string
}