import { ICreateOptions } from "src/interface/respository/icreateoptions";

export class UserCreateOptions implements ICreateOptions {
    readonly email?: string
    password?: string
    readonly name?: string
    readonly address?: string
}