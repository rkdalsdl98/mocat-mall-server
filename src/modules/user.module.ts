import { Module } from '@nestjs/common';
import { UserController } from 'src/controllers/user.controller';
import { UserRepository } from 'src/repository/user.repository';
import { CouponService } from 'src/services/coupon.service';
import { EmailService } from 'src/services/mailer.service';
import RedisService from 'src/services/redis.service';
import { UserService } from 'src/services/user.service';
import { CouponModule } from './coupon.module';
import { CouponRepository } from 'src/repository/coupon/coupon.repository';
import { AuthModule } from './auth.module';
import { AuthService } from 'src/services/auth.service';

@Module({
    imports: [
        CouponModule,
        AuthModule,
    ],
    controllers: [UserController],
    providers: [
        EmailService,
        UserService,
        RedisService,
        CouponService,
        AuthService,
        {
            provide: "UserRepository",
            useClass: UserRepository,
        },
        {
            provide: "CouponRepository",
            useClass: CouponRepository,
        }
    ],
    exports: [],
})
export class UserModule {}