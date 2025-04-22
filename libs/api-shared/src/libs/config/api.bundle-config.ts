import { TYPEORM_MODULE_CONFIG } from './typeorm.module-config';
import { REDIS_CACHE_MODULE_CONFIG } from './cache.module-config';
import { I18N_MODULE_CONFIG } from './i18n.module-config';
import { MAILER_MODULE_CONFIG } from './mailer.module-config';
import { GCP_PROVIDER_CONFIG } from './gcp.provider';

export const apiBundleConfig = {
    TypeOrmModule: TYPEORM_MODULE_CONFIG,
    RedisCacheModule: REDIS_CACHE_MODULE_CONFIG,
    I18nModule: I18N_MODULE_CONFIG,
    MailerModule: MAILER_MODULE_CONFIG,
    GCPStorageModule: GCP_PROVIDER_CONFIG
};
