import { DynamicModule, Global, Module } from '@nestjs/common';
import { EnvModule } from './env/src/lib/env.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { apiBundleConfig } from './config/api.bundle-config';
import { ClientProxyService } from './services/src/lib/client-proxy.service';
import { CacheModule } from '@nestjs/cache-manager';
import { I18nModule } from 'nestjs-i18n';
import { MailerModule } from '@nestjs-modules/mailer';
import { KAFKA_CLIENT_PROXY, TCP_CLIENT_PROXY } from './services/src';
import { EnvService } from './env/src';

@Global()
@Module({})
export class CoreApiSharedModule {
    static forRootAsync(config?: {
        i18nPathFile?: string
    }): DynamicModule {
        const moduleConfigs = {
            ...apiBundleConfig
        };

        const PROJECT_MODULES = [
            EnvModule
        ];

        const NEST_MODULES = [
            TypeOrmModule.forRootAsync(moduleConfigs.TypeOrmModule()),
            CacheModule.registerAsync(moduleConfigs.RedisCacheModule()),
            I18nModule.forRootAsync(moduleConfigs.I18nModule(config?.i18nPathFile)),
            MailerModule.forRootAsync(moduleConfigs.MailerModule()),
            ThrottlerModule.forRoot([{
                ttl: 60,
                limit: 1000
            }])
        ];

        return {
            imports: [...NEST_MODULES, ...PROJECT_MODULES],
            providers: [
                ClientProxyService,
                {
                    provide: TCP_CLIENT_PROXY,
                    useFactory: (envService: EnvService) => {
                        const service = new ClientProxyService<'TCP'>(envService);
                        (service as any).transportType = 'TCP';
                        return service;
                    },
                    inject: [EnvService]
                },
                {
                    provide: KAFKA_CLIENT_PROXY,
                    useFactory: (envService: EnvService) => {
                        const service = new ClientProxyService<'KAFKA'>(envService);
                        (service as any).transportType = 'KAFKA';
                        return service;
                    },
                    inject: [EnvService]
                }
            ],
            module: CoreApiSharedModule,
            exports: [ClientProxyService, TCP_CLIENT_PROXY, KAFKA_CLIENT_PROXY, ...NEST_MODULES, ...PROJECT_MODULES]
        };
    }
}
