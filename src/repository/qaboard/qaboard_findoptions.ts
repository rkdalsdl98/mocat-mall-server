import { IFindOptions } from "src/interface/options/ifindoptions";

export interface QABoardFindOptions extends IFindOptions {
    readonly boardId?: number
}