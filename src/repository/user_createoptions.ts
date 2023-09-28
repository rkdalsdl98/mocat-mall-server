import { ICreateOptions } from "src/interface/respository/icreateoptions";

export class UserCreateOptions implements ICreateOptions {
    readonly email: string
    readonly password: string
    readonly salt: string
    readonly name: string
    readonly address: string
}