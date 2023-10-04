import { 
    CallHandler, 
    ExecutionContext, 
    Injectable, 
    NestInterceptor,
    BadRequestException,
} from "@nestjs/common";
import { Observable, of } from "rxjs";
import { tap } from 'rxjs/operators';
import { IOptionsQuery } from "src/query/ioptions.query";
import { ERROR, ResponseFailedForm } from "../form/response.form";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) : Observable<any> {
        const req = context.switchToHttp().getRequest()

        const { path, methods } = req.route
        const method = Object.keys(methods)[0]
        const reqAddress = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress
        const query : IOptionsQuery = req.query

        let uniData
        if("email" in query) uniData = query.email
        else if("coupon" in query) uniData = query.coupon
        else if ("boardId" in query) uniData = query.boardId
        else if("productId" in query) uniData = query.productId
        else return of(ERROR.BadRequest)

        if(method === null) return of(ERROR.BadRequest)
        const before = Date.now()
        console.log(`[${Intl.DateTimeFormat('kr').format(before)}]: ${reqAddress} : ${uniData} :[${path} : ${method}]`)
        return next.handle().pipe(
            tap(_=> console.log(`[요청 처리 성공] ${ Date.now() - before}/ms`))
        )
    }
}