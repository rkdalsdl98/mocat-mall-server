import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import * as dotenv from 'dotenv';
import RedisService from 'src/services/redis.service';

dotenv.config()

@Module({
    imports: [
        CacheModule.register({
            store: redisStore,
            host: process.env.SERVER_IP,
            port: 6379,
            ttl: 60,
            isGlobal: true,
        })
    ],
    providers: [RedisService],
    exports: [RedisService]
})
export default class RedisModule {}