import { IOptionsQuery } from "./ioptions.query";

export interface IOrderQuery extends IOptionsQuery {}
export namespace IOrderQuery {
    export interface IOrderQueryPaymentOptions extends IOptionsQuery {}
    export interface IOrderQueryCancelOptions extends IOptionsQuery {}
    export interface IOrderQueryFindOptions extends IOptionsQuery {}
}