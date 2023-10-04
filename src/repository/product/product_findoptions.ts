import { IFindOptions } from "src/interface/options/ifindoptions";

export interface ProductFindOptions extends IFindOptions {
    readonly productId?: number
}