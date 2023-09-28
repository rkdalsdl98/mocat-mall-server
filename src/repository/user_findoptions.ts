import { IFindOptions } from "src/interface/respository/ifindoptions";

export class UserFindOptions implements IFindOptions {
    readonly id?: number
    readonly email?: string
}