import { tags } from "typia"

export interface IQABoardQuery {
    readonly boardId?: number & tags.Type<"uint32">
}
export namespace IQABoardQuery {
    export interface IQABoardQueryUpdateOtions extends IQABoardQuery {}
    export interface IQABoardQueryDeleteOptions extends IQABoardQuery {}
}