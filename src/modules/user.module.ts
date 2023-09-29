import { Module } from '@nestjs/common';
import { UserController } from 'src/controllers/user.controller';
import { UserRepository } from 'src/repository/user.repository';
import { EmailService } from 'src/services/mailer.service';
import RedisService from 'src/services/redis.service';
import { UserService } from 'src/services/user.service';

@Module({
    imports: [],
    controllers: [UserController],
    providers: [
        EmailService,
        UserService,
        RedisService,
        {
            provide: "UserRepository",
            useClass: UserRepository,
        },
    ]
})
export class UserModule {}