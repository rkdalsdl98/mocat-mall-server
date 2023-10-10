import { ICreateOptions } from "src/interface/options/icreateoptions"

export interface QABoardCreateOptions extends ICreateOptions {
    readonly title?: string
    readonly productIds?: number[]
    readonly contentText: string
    readonly writerEmail: string
    readonly writerName: string
}