import { IFindOptions } from "src/interface/options/ifindoptions";

export interface UserLoginOptions extends IFindOptions {
    readonly email: string
    readonly password: string
}