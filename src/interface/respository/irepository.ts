import { ICreateOptions } from "./icreateoptions";
import { IFindOptions } from "./ifindoptions";
import { IUpdateOptions } from "./iupdateoptions";

export interface IRepository<T>{
    get(args?: IFindOptions) : Promise<T[] | T>
    getBy(args?: IFindOptions) : Promise<T | null | undefined>
    updateBy(data: IUpdateOptions, args?: IFindOptions) : Promise<void>
    deleteBy(args?: IFindOptions) : Promise<void>
    create(data: ICreateOptions) : Promise<T>
    toEntity(value) : T
}