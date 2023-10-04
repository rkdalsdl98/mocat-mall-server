import { ICreateOptions } from "../options/icreateoptions";
import { IFindOptions } from "../options/ifindoptions";
import { IUpdateOptions } from "../options/iupdateoptions";

export interface IRepository<T>{
    get?(args?: IFindOptions) : Promise<T[]>
    getBy?(args?: IFindOptions) : Promise<T | null | undefined>
    updateBy?(data: IUpdateOptions, args?: IFindOptions) : Promise<unknown>
    deleteBy?(args?: IFindOptions) : Promise<void>
    create?(data: ICreateOptions, args?: unknown) : Promise<unknown>
    toEntity?(value) : T | undefined | null
}