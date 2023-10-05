import { Module } from '@nestjs/common';
import { UserController } from 'src/controllers/user.controller';
import { UserRepository } from 'src/repository/user.repository';
import { CouponService } from 'src/services/coupon.service';
import { EmailService } from 'src/services/mailer.service';
import RedisService from 'src/services/redis.service';
import { UserService } from 'src/services/user.service';
import { CouponModule } from './coupon.module';
import { CouponRepository } from 'src/repository/coupon/coupon.repository';
import { JwtStrategy } from 'src/common/jwt/jwt_strategy';
import { JwtService } from "@nestjs/jwt";
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        CouponModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [UserController],
    providers: [
        EmailService,
        UserService,
        RedisService,
        CouponService,
        JwtStrategy,
        JwtService,
        {
            provide: "UserRepository",
            useClass: UserRepository,
        },
        {
            provide: "CouponRepository",
            useClass: CouponRepository,
        }
    ],
    exports: [
        JwtStrategy,
        PassportModule,
    ],
})
export class UserModule {}