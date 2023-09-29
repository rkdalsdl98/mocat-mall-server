import { 
    CallHandler, 
    ExecutionContext, 
    Injectable, 
    NestInterceptor,
    BadRequestException
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) : Observable<any> {
        const req = context.switchToHttp().getRequest()
        const { email, name } = req.query
        if(email === null || name === null) throw new BadRequestException()

        const { path, methods } = req.route
        const method = Object.keys(methods)[0]

        if(method === null) throw new BadRequestException()
        const before = Date.now()
        console.log(`[${Intl.DateTimeFormat('kr').format(before)}]: ${email} : ${name} : [${path} : ${method}]`)
        return next.handle().pipe(
            tap(_=> console.log(`[요청 처리 성공] ${ Date.now() - before}/ms`))
        )
    }
}