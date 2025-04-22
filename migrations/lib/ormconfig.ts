import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions, getMetadataArgsStorage } from 'typeorm';
import { join } from 'path';

dotenv.config({ path: 'envs/development.env' });

/*
* @Description Generate Migrations for typeorm
* CREATE Migrations for typeorm
* node --require ts-node/register ../../node_modules/typeorm/cli.js migration:create [MigrationName]
* After crate the migration do not forget to execute pnpm run migration:build to generate the migration files
* */

const config: DataSourceOptions & { cli?: { migrationsDir?: string } } = {
    type: 'postgres',
    host: process.env['DB_HOST'],
    port: Number(process.env['DB_PORT']),
    username: process.env['DB_USERNAME'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_NAME'],
    entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: process.env['DB_SYNCHRONIZE'] as never,
    logging: process.env['DB_LOGGING'] === 'true' ? 'all' : false,
    migrationsRun: true,
    cli: {
        migrationsDir: join(__dirname + '/migrations/lib/migrations'),
    }
};

export const AppDataSource = new DataSource(config);


