import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
import { EnvService } from '../env/src/lib/env.service';


export const TYPEORM_MODULE_CONFIG: () => TypeOrmModuleAsyncOptions = () => ({
    imports: [],
    inject: [EnvService],
    useFactory: (env: EnvService) => ({
        type: 'postgres',
        host: env.get('DATABASE').DB_HOST,
        port: env.get('DATABASE').DB_PORT,
        username: env.get('DATABASE').DB_USERNAME,
        password: env.get('DATABASE').DB_PASSWORD,
        database: env.get('DATABASE').DB_NAME,
        schema: env.get('DATABASE').DB_SCHEMA || 'public',
        entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: env.get('DATABASE').DB_SYNCHRONIZE as any,
        logging: env.get('DATABASE').DB_LOGGING === 'true' ? 'all' : false,
    })
});
