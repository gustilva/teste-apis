import { EnvService } from '../env/src/lib/env.service';
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';


export const REDIS_CACHE_MODULE_CONFIG: () => CacheModuleAsyncOptions = () => ({
    imports: [],
    inject: [EnvService],
    useFactory: (env: EnvService) => ({
        isGlobal: true,
        store: redisStore,
        host: env.get('DATABASE').REDIS_DB_HOST,
        port: Number(env.get('DATABASE').REDIS_DB_PORT),
        password: env.get('DATABASE').REDIS_DB_PASSWORD,
        ttl: Number(env.get('DATABASE').REDIS_TTL)
    })
});
