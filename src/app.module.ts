import { Module } from '@nestjs/common';
import RedisModule from './modules/redis.module';
import { UserModule } from './modules/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import smtpConfig from 'smtp.config';
import { CouponModule } from './modules/coupon.module';

@Module({
  imports: [
    RedisModule, 
    UserModule,
    CouponModule,
    MailerModule.forRoot(smtpConfig),
  ],
})
export class AppModule {}
