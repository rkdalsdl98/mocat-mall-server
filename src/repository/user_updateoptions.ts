import { IUpdateOptions } from "src/interface/options/iupdateoptions"

export interface UserUpdateOptions extends IUpdateOptions {
    readonly name?: string
    readonly address?: string
}