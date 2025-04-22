import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from "./env.service";
import { envFactory } from "./env.factory";
import * as path from 'node:path';

const envFileConfigPath = path.join(process.cwd(), 'envs',  process.env['ENV_FILE_PATH'] || `${process.env['NODE_ENV'] || ''}.env`);

export const API_ENV_CONFIG_PATH = Symbol('API_ENV_CONFIG_PATH');

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFileConfigPath,
      load: [envFactory],
      isGlobal: true,
    }),
  ],
  providers: [
    EnvService,
    {
      provide: API_ENV_CONFIG_PATH,
      useValue: envFileConfigPath,
    },
  ],
  exports: [EnvService],
})
export class EnvModule {}
