import { tags } from "typia"

export interface IPayload {
    readonly iat?: number & tags.Type<"int32">
    readonly exp?: number & tags.Type<"int32">
}
export namespace IPayload {
    export interface IPayloadByUser extends IPayload {
        readonly email?: string & tags.Format<"email">
    }
}