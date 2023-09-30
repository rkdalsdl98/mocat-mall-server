import { tags } from "typia"

export interface IUserQuery {
    readonly findoption?: IUserQuery.IUserQueryFindOptions
}
export namespace IUserQuery {
    export interface IUserQueryFindOptions {
        readonly id?: number & tags.Type<"uint32">
        readonly email?: string & tags.Format<"email">
        readonly name?: string & tags.MaxLength<10>
    }

    export interface IUserQueryUpdateOptions extends IUserQuery.IUserQueryFindOptions {
        readonly address?: string & tags.MaxLength<50>
    }

    export interface IUserQueryCreateOptions extends IUserQuery.IUserQueryFindOptions {
        readonly password?: string & tags.MinLength<9>
        readonly address?: string & tags.MaxLength<50>
    }

    export interface IUserQueryQABoardOptions extends IUserQuery.IUserQueryFindOptions {
        readonly title?: string & tags.MaxLength<20>
        readonly contentText?: string & tags.MaxLength<200>
        readonly productId?: number & tags.Type<"uint32">
        readonly writerEmail?: string & tags.Format<"email">
        readonly writerName?: string & tags.MaxLength<10>
    }

    export interface IUserQueryAddReplyOptions {
        readonly contentText?: string & tags.MaxLength<50>
        readonly writerEmail?: string & tags.Format<"email">
        readonly writerName?: string & tags.MaxLength<10>
        readonly boardId?: number & tags.Type<"uint32">
    }

    export interface IUserQueryUpdateOrderOptions extends IUserQuery.IUserQueryFindOptions {
        readonly orderId?: string & tags.MaxLength<60>
        readonly paymentKey?: string & tags.MaxLength<50>
    }
}