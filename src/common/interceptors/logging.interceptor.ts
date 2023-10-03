import { 
    CallHandler, 
    ExecutionContext, 
    Injectable, 
    NestInterceptor,
    BadRequestException,
    BadGatewayException
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';
import { IOptionsQuery } from "src/query/ioptions.query";

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
        else throw new BadGatewayException()

        if(method === null) throw new BadRequestException()
        const before = Date.now()
        console.log(`[${Intl.DateTimeFormat('kr').format(before)}]: ${reqAddress} : ${uniData} :[${path} : ${method}]`)
        return next.handle().pipe(
            tap(_=> console.log(`[요청 처리 성공] ${ Date.now() - before}/ms`))
        )
    }
}