import { EnvService } from '../env/src/lib/env.service';
import { I18nAsyncOptions } from 'nestjs-i18n/dist/interfaces/i18n-options.interface';
import * as path from 'node:path';
import { AcceptLanguageResolver, CookieResolver, HeaderResolver, QueryResolver } from 'nestjs-i18n';

export const I18N_MODULE_CONFIG: (i18nPath?: string) => I18nAsyncOptions =
    (i18nPath?: string): I18nAsyncOptions => ({
        imports: [],
        inject: [EnvService],
        useFactory: (env: EnvService) => {
            const resolvedPath = i18nPath ? path.resolve(process.cwd() + i18nPath) : path.resolve(process.cwd() + env.get('APP')?.I18N_PATH);
            return {
                fallbackLanguage: env.get('APP')?.DEFAULT_LANGUAGE || 'en',
                loaderOptions: {
                    path: resolvedPath,
                    watch: true,
                    include: []
                }
            };
        },
        resolvers: [
            new QueryResolver(["lang", "l"]),
            new HeaderResolver(["x-custom-lang"]),
            new CookieResolver(),
            AcceptLanguageResolver,
        ]
    });
