import { ICreateOptions } from "src/interface/options/icreateoptions";

export interface UserCreateOptions extends ICreateOptions {
    readonly email: string
    readonly password: string
    readonly name: string
    readonly address: string
}