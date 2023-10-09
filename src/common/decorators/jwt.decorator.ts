import { 
    createParamDecorator, 
    ExecutionContext,
} from "@nestjs/common";

export namespace JwtDecorator {
    export const GetTokenAndPayload = createParamDecorator((data, context: ExecutionContext) : { payload: Object, token: string } => {
        const { user: payload, headers } = context.switchToHttp().getRequest()
        const [ type, token ] = headers.authorization.split(" ")
        return { payload, token }
    })
}