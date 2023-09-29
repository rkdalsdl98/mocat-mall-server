import { UserFindOptions } from "src/repository/user_findoptions";
import { UserUpdateOptions } from "src/repository/user_updateoptions";
 
export namespace IUserQuery {
    export interface IUpdate {
        readonly findoptions: UserFindOptions
        readonly updateoptions: UserUpdateOptions
    }
}