import { tags } from "typia"
import { IOptionsQuery } from "./ioptions.query"

export interface IUserQuery extends IOptionsQuery {
    readonly email?: string & tags.Format<"email">
    readonly name?: string & tags.MaxLength<10>
}
export namespace IUserQuery {
    export interface IUserQueryUpdateOptions extends IUserQuery {
        readonly address?: string & tags.MaxLength<50>
    }

    export interface IUserQueryCreateOptions extends IUserQuery {
        readonly password?: string & tags.MinLength<9>
        readonly address?: string & tags.MaxLength<50>
    }

    export interface IUserQueryQABoardOptions extends IUserQuery {
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

    export interface IUserQueryUpdateOrderOptions extends IUserQuery {
        readonly orderId?: string & tags.MaxLength<60>
        readonly paymentKey?: string & tags.MaxLength<50>
    }

    export interface IUserQueryConnectCouponOptions extends IUserQuery {
       readonly coupon: string & tags.MinLength<37> & tags.MaxLength<39>
    }
}