import { IUpdateOptions } from "src/interface/respository/iupdateoptions";

export class UserUpdateOptions implements IUpdateOptions {
    readonly name?: string
    readonly address?: string
}