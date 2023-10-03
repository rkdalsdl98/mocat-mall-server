import { tags } from "typia"
import { IOptionsQuery } from "./ioptions.query"

export interface IQABoardQuery extends IOptionsQuery {
    readonly boardId?: number & tags.Type<"uint32">
}
export namespace IQABoardQuery {
    export interface IQABoardQueryCreateOptions {
        readonly title?: string & tags.MaxLength<20>
        readonly productId?: number & tags.Type<"uint32">
        readonly contentText: string & tags.MaxLength<50>
        readonly writerEmail: string & tags.Format<"email">
        readonly writerName: string & tags.MaxLength<10>
    }

    export interface IQABoardQueryUpdateOtions extends IQABoardQuery {
        readonly title?: string & tags.MaxLength<20>
        readonly productId?: number & tags.Type<"uint32">
        readonly contentText?: string & tags.MaxLength<50>
    }
}