import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import * as dotenv from 'dotenv';
import RedisService from 'src/services/redis.service';

dotenv.config()

let serverIP : string | undefined

switch(process.env.SERVER_SCRIPT) {
    case "PRODUCT":
        serverIP = process.env.SERVER_IP
        break
    case "TEST":
    case "DEV":
        serverIP = process.env.SERVER_IP_DEV
        break
    default:
        throw new Error("정의되지 않은 환경")
}

@Module({
    imports: [
        CacheModule.register({
            store: redisStore,
            host: serverIP,
            port: 6379,
            ttl: 60,
            isGlobal: true,
        })
    ],
    providers: [RedisService],
    exports: [RedisService]
})
export default class RedisModule {}