import { Module } from '@nestjs/common';
import RedisModule from './modules/redis.module';
import { UserModule } from './modules/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import smtpConfig from 'smtp.config';
import { CouponModule } from './modules/coupon.module';
import { QABoardModule } from './modules/qaboard.module';
import { ProductModule } from './modules/product.module';
import { OrderService } from './services/order.service';

@Module({
  imports: [
    RedisModule, 
    UserModule,
    CouponModule,
    QABoardModule,
    ProductModule,
    OrderService,
    MailerModule.forRoot(smtpConfig),
  ],
})
export class AppModule {}
