import { 
    createParamDecorator, 
    ExecutionContext,
} from "@nestjs/common";

export const GetTokenAndPayload = createParamDecorator((data, context: ExecutionContext) : { payload: Object, token: string } => {
    const { user, headers } = context.switchToHttp().getRequest()
    const [ type, token ] = headers.authorization.split(" ")
    
    return { payload: user, token }
})