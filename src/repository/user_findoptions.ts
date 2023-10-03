import { IFindOptions } from "src/interface/options/ifindoptions"

export interface UserFindOptions extends IFindOptions {
    readonly id?: number
    readonly email?: string
}