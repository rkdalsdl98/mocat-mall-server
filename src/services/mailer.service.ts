import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import * as dotenv from 'dotenv';
import { MailTemplate } from "src/types/mail_template.types";
import { SentMessageInfo } from 'nodemailer';
import { Injectable } from "@nestjs/common";

dotenv.config()

const port : string | undefined = process.env.PORT

let serverIP : string | undefined
let authemail: string | undefined

switch(process.env.SERVER_SCRIPT) {
    case "PRODUCT":
        serverIP = process.env.SERVER_IP
        authemail = process.env.AUTH_EMAIL
        break
    case "TEST":
    case "DEV":
        serverIP = process.env.SERVER_IP_DEV
        authemail = process.env.AUTH_EMAIL_DEV
        break
    default:
        throw new Error("정의되지 않은 환경")
}

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) {}
    private _authorizationTemplate(to: string, secret: string) : string {
        return `
        <br>
            <form 
            action="http://${serverIP}:${port}/user/${to}" 
            method="post"
            >
                <p>${secret}</p>
                <p>상단에 보이는 숫자를 어플화면에서 입력하고 확인을 눌러주세요.</p>
                <input
                type="text" 
                name="code"
                />
                <input
                type="submit"
                value="보내기"
                />
            </form>
        </br>
    `
    }
    private _defaultTemplate(message: string) : string {
        return `<br><p>${message}</p></br>`
    }  

    async sendMail(
        template: MailTemplate, 
    ) : Promise<SentMessageInfo> {
        let config: ISendMailOptions = {
            to: template.to,
            from: authemail,
            subject: template.title,
        }
        if("secret" in template) {
            config.html = this._authorizationTemplate(template.to, template.secret)
        } else {
            config.html = this._defaultTemplate(template.message)
        }
        return await this.mailerService.sendMail(config)
    }
}
