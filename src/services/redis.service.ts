import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from '@nestjs/cache-manager/dist';
import { Cache } from 'cache-manager';

@Injectable()
export default class RedisService {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly redisClient: Cache
    ){}

    async get<T>(key : string) : Promise<T>{
        return await this.redisClient.get(key)
        .catch(e => {
            throw e
        }) as T
    }

    async set(key : string, value : unknown, ttl? : number | undefined) : Promise<void> {
        await this.redisClient.set(key, value, ttl)
        .catch(e => {
            throw e
        })
    }

    async delete(key: string) : Promise<void> {
        await this.redisClient.del(key)
        .catch(e => {
            throw e
        })
    }

    async reset() : Promise<void> {
        await this.redisClient.reset()
        .catch(e => {
            throw e
        })
    }
}