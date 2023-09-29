import { IFindOptions } from "src/interface/respository/ifindoptions";
import { tags } from "typia"

export class UserFindOptions implements IFindOptions {
    readonly id?: number & tags.Type<"uint32">
    readonly email?: string
}