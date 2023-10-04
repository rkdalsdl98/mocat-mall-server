import { ICreateOptions } from "src/interface/options/icreateoptions"

export interface QABoardCreateOptions extends ICreateOptions {
    readonly title?: string
    readonly contentText: string
    readonly writerEmail: string
    readonly writerName: string
}