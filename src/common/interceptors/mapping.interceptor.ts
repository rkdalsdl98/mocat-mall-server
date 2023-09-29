import { 
    CallHandler, 
    ExecutionContext, 
    Injectable, 
    NestInterceptor,
    BadRequestException
} from "@nestjs/common";
import { Observable, catchError, of } from "rxjs";
import { tap, map } from 'rxjs/operators';

@Injectable()
export class MappingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) : Observable<any> {
        return next.handle().pipe(
            map(v => {console.log("map\n", v)})
            ,catchError(err => {
                console.log(err)
                throw new BadRequestException()
            })
        )
    }
}