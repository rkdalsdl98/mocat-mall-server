import { TypedQuery, TypedRoute } from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtDecorator } from "src/common/decorators/jwt.decorator";
import { ERROR, ResponseFailedForm, TryCatch } from "src/common/form/response.form";
import { AuthJwtGuard } from "src/common/guards/auth.guard";
import { ProductDto } from "src/dto/product.dto";
import { IProductQuery } from "src/query/iproduct.query";
import { ProductService } from "src/services/product.service";

@Controller("product")
@ApiTags("상품")
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ){}

    // 페이징 식으로 구현 해야 함
    /**
     * 상품 리스트 불러오기
     * 
     * @returns 상품 리스트
     */
    @TypedRoute.Get()
    async getProducts() : Promise<TryCatch<
    ProductDto[]
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.ServerCacheError
    >> {
        return await this.productService.getProducts()
    }

    /**
     * 상품 불러오기
     * 
     * @returns 상품
     */
    @TypedRoute.Get("byid")
    async getProductBy(
        @TypedQuery() query: IProductQuery
    ) : Promise<TryCatch<
    ProductDto | undefined | null
    ,
    | typeof ERROR.BadRequest
    | typeof ERROR.ServerDatabaseError
    | typeof ERROR.ServerCacheError
    | typeof ERROR.NotFoundData
    >> {
        return await this.productService.getProductBy({ productId: query.productId })
    }

    /**
     * 상품 등록
     * 
     * 권한이 있는 사람만 가능
     */
    @TypedRoute.Post()
    @UseGuards(AuthJwtGuard)
    async addProduct(
        @JwtDecorator.GetTokenAndPayload() data: { payload: Object, token: string },
        @TypedQuery() query: IProductQuery.IProductQueryUpdateOrCreateOptions
    ) : Promise<TryCatch<
    boolean
    ,
    ResponseFailedForm>> {
        if("type" in data.payload && "response" in data.payload) 
            return data.payload.response as ResponseFailedForm
        else if(!("auth" in data.payload)) return ERROR.UnAuthorized
        return await this.productService.addProduct({
            price: query.price,
            productName: query.productName,
            thumbnail: query.thumbnail,
            colors: query.colors,
            sizes: query.sizes,
            images: query.images,
            description: query.descriptions,
        }, data.payload)
    }

    /**
     * 상품 갱신
     * 
     * 권한이 있는 사람만 가능
     */
    @TypedRoute.Patch()
    @UseGuards(AuthJwtGuard)
    async updateProduct(
        @JwtDecorator.GetTokenAndPayload() data: { payload: Object, token: string },
        @TypedQuery() query: IProductQuery.IProductQueryUpdateOrCreateOptions
    ) : Promise<TryCatch<
    boolean
    ,
    ResponseFailedForm>> {
        if("type" in data.payload && "response" in data.payload) 
            return data.payload.response as ResponseFailedForm
        else if(!("auth" in data.payload)) return ERROR.UnAuthorized
        return await this.productService.updateProduct({
            price: query.price,
            productName: query.productName,
            thumbnail: query.thumbnail,
            colors: query.colors,
            sizes: query.sizes,
            images: query.images,
            description: query.descriptions,
        }, { productId: query.productId }, data.payload)
    }

    /**
     * 상품 삭제
     * 
     * 권한이 있는 사람만 가능
     */
    @TypedRoute.Delete()
    @UseGuards(AuthJwtGuard)
    async deleteProduct(
        @JwtDecorator.GetTokenAndPayload() data: { payload: Object, token: string },
        @TypedQuery() query: IProductQuery.IProductQueryDeleteOptions
    ) : Promise<TryCatch<
    boolean
    ,
    ResponseFailedForm>> {
        if("type" in data.payload && "response" in data.payload) 
            return data.payload.response as ResponseFailedForm
        else if(!("auth" in data.payload)) return ERROR.UnAuthorized
        return await this.productService.deleteProduct({ productId: query.productId }, data.payload)
    }
}