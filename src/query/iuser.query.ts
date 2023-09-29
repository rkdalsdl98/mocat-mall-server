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
        readonly id?: number & tags.Type<"uint32">
        readonly email?: string & tags.Format<"email">
        readonly name?: string & tags.MaxLength<10>
        readonly address?: string & tags.MaxLength<50>
    }
}