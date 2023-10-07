import { Module } from '@nestjs/common';
import RedisModule from './modules/redis.module';
import { UserModule } from './modules/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CouponModule } from './modules/coupon.module';
import { QABoardModule } from './modules/qaboard.module';
import { ProductModule } from './modules/product.module';

import smtpConfig from 'smtp.config';

@Module({
  imports: [
    RedisModule, 
    UserModule,
    CouponModule,
    QABoardModule,
    ProductModule,
    MailerModule.forRoot(smtpConfig),
  ]
})
export class AppModule {}
