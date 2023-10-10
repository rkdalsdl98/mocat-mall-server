import { Injectable } from "@nestjs/common";
import { ProductRepository } from "src/repository/product/product.repository";
import RedisService from "./redis.service";
import { ProductDto } from "src/dto/product.dto";
import { ProductEntity } from "src/entity/product.entity";
import { ProductFindOptions } from "src/repository/product/product_findoptions";
import { ProductCreateOptions } from "src/repository/product/product_createoptions";
import { ProductUpdateOptions } from "src/repository/product/product_updateoptions";
import { ERROR, TryCatch } from "src/common/form/response.form";
import { IPayload } from "src/interface/jwt/ipayload";
import { UserEntity } from "src/entity/user.entity";
import { AuthService } from "./auth.service";

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly redisService: RedisService,
        private readonly authService: AuthService,
    ){}

    async getProducts() : Promise<TryCatch<
    ProductDto[]
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.ServerCacheError
    >> {
        try {
            const caches = await this.redisService.get<ProductEntity[]>("products", ProductService.name)
            if(caches) return { statuscode: 200, data: caches.map(p => ProductDto.fromEntity(p)) }

            const entites = await this.productRepository.get()
            return { statuscode: 200, data: entites.map(p => ProductDto.fromEntity(p)) }
        } catch(e) { return e }
    }

    async getProductBy(args: ProductFindOptions) : Promise<TryCatch<
    ProductDto | undefined | null
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.ServerCacheError
    | typeof ERROR.NotFoundData
    >> {
        try {
            const caches = await this.redisService.get<ProductEntity[]>("products", ProductService.name)
            if(caches) {
                const cache = caches.find(p => p.id === args.productId)
                if(cache) return { statuscode: 200, data: ProductDto.fromEntity(cache) }
            }
            
            const entity = await this.productRepository.getBy(args)
            if(entity) return { statuscode: 200, data: ProductDto.fromEntity(entity) }  
            return ERROR.NotFoundData
        } catch(e) { return e }
    }

    // 권한이있는 사람만 상품 등록 가능
    async addProduct(data: ProductCreateOptions, payload: Object) : Promise<TryCatch<
    boolean
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.ServiceUnavailableException
    | typeof ERROR.UnAuthorized
    >> {
        try {
            const employeePayload = {
                email: payload['email'],
                code: payload['auth']['code'],
                authority: payload['auth']['authority']
            } as IPayload.IPayloadEmployee
            const users = await this.redisService.get<UserEntity[]>("users", ProductService.name)
            if(!users) return ERROR.ServiceUnavailableException
            const employee = users.find(u => u.email === employeePayload.email)
            const check = this.checkAuthority(employee, employeePayload)
            if(check) {
                const entity = await this.productRepository.create(data)
                let caches = await this.redisService.get<ProductEntity[]>("products", ProductService.name)
                if(caches) {
                    caches.push(entity)
                    await this.redisService.set("products", caches, ProductService.name)
                }

                return { statuscode: 201, data: true }
            } else return ERROR.UnAuthorized
        } catch(e) { return e }
    }

    // 권한이있는 사람만 상품 갱신 가능
    async updateProduct(
        data: ProductUpdateOptions, 
        args: ProductFindOptions,
        payload: Object,
    ) : Promise<TryCatch<
    boolean
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.ServiceUnavailableException
    | typeof ERROR.UnAuthorized
    >> {
        try {
            const employeePayload = {
                email: payload['email'],
                code: payload['auth']['code'],
                authority: payload['auth']['authority']
            } as IPayload.IPayloadEmployee
            const users = await this.redisService.get<UserEntity[]>("users", ProductService.name)
            if(!users) return ERROR.ServiceUnavailableException
            const employee = users.find(u => u.email === employeePayload.email)
            const check = this.checkAuthority(employee, employeePayload)
            if(check) {
                const entity = await this.productRepository.updateBy(data, args)
                let caches = await this.redisService.get<ProductEntity[]>("products", ProductService.name)
                if(caches) {
                    caches = caches.filter(p => p.id !== entity.id)
                    caches.push(entity)
                    await this.redisService.set("products", caches, ProductService.name)
                }
                return { statuscode: 201, data: true }
            } else return ERROR.UnAuthorized
        } catch(e) { return e }
    }

    // 권한이있는 사람만 상품 삭제 가능
    async deleteProduct(args: ProductFindOptions, payload: Object,) : Promise<TryCatch<
    boolean
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.ServiceUnavailableException
    | typeof ERROR.UnAuthorized
    >> {
        try{
            const employeePayload = {
                email: payload['email'],
                code: payload['auth']['code'],
                authority: payload['auth']['authority']
            } as IPayload.IPayloadEmployee
            const users = await this.redisService.get<UserEntity[]>("users", ProductService.name)
            if(!users) return ERROR.ServiceUnavailableException
            const employee = users.find(u => u.email === employeePayload.email)
            const check = this.checkAuthority(employee, employeePayload)
            if(check) {
                let caches = await this.redisService.get<ProductEntity[]>("products", ProductService.name)
                if(caches) {
                    caches = caches.filter(p => p.id !== args.productId)
                    await this.redisService.set("products", caches, ProductService.name)
                }
                await this.productRepository.deleteBy(args)
                return { statuscode: 200, data: true }
            } else return ERROR.UnAuthorized
        } catch(e) { return e }
    }

    checkAuthority(
        employee?: UserEntity,
        employeePayload?: IPayload.IPayloadEmployee
    ) : boolean {
        if( employee === undefined 
            ||
            employeePayload === undefined
            ||
            employee.authority === null
            || 
            (!this.authService.verifyCode(
                employee.authority.salt, 
                employeePayload.code!, 
                employee.authority.code
            ) && employeePayload.authority === "none")) false
        return true
    }
}