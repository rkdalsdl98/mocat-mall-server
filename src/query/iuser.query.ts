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
}