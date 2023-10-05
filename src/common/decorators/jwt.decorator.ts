import { 
    createParamDecorator, 
    ExecutionContext,
} from "@nestjs/common";

export const GetToken = createParamDecorator((data, context: ExecutionContext) : { email: string, token: string } => {
    const { user : res, headers } = context.switchToHttp().getRequest()
    const { email } = res
    const [ type, token ] = headers.authorization.split(" ")
    
    return { email, token }
})