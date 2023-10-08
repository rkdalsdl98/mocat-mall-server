import { tags } from "typia"
import { IOptionsQuery } from "./ioptions.query"

export interface IUserQuery extends IOptionsQuery {}
export namespace IUserQuery {
    export interface IUserQueryLoginOptions extends IUserQuery {
        readonly email: string & tags.Format<"email">
        readonly password: string & tags.MinLength<9> & tags.MaxLength<20>
    }

    export interface IUserQueryUpdateOptions extends IOptionsQuery {
        readonly address?: string & tags.MaxLength<50>
        readonly name?: string & tags.MaxLength<10>
    }

    export interface IUserQueryCreateOptions extends IUserQuery {
        readonly email: string & tags.Format<"email">
        readonly password: string & tags.MinLength<9> & tags.MaxLength<20>
        readonly address: string & tags.MaxLength<50>
        readonly name: string & tags.MaxLength<10>
    }

    export interface IUserQueryQABoardOptions extends IOptionsQuery {
        readonly title?: string & tags.MaxLength<20>
        readonly contentText?: string & tags.MaxLength<200>
        readonly productId?: number & tags.Type<"uint32">
        readonly writerEmail?: string & tags.Format<"email">
        readonly writerName?: string & tags.MaxLength<10>
    }

    export interface IUserQueryAddReplyOptions extends IUserQuery {
        readonly contentText?: string & tags.MaxLength<50>
        readonly writerEmail?: string & tags.Format<"email">
        readonly writerName?: string & tags.MaxLength<10>
        readonly boardId?: number & tags.Type<"uint32">
    }

    export interface IUserQueryUpdateOrderOptions extends IOptionsQuery {
        readonly orderId?: string & tags.MaxLength<60>
        readonly paymentKey?: string & tags.MaxLength<50>
    }

    export interface IUserQueryConnectCouponOptions extends IOptionsQuery {
       readonly coupon: string & tags.MinLength<37> & tags.MaxLength<39>
    }
}