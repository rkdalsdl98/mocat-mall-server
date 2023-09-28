import { Module } from '@nestjs/common';
import RedisModule from './modules/redis.module';
import { UserModule } from './modules/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import smtpConfig from 'smtp.config';

@Module({
  imports: [
    RedisModule, 
    UserModule,
    MailerModule.forRoot(smtpConfig),
  ],
})
export class AppModule {}
