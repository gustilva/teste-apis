import { configSchema, Env } from './env.schema';

export const envFactory = (): Env => {
    return configSchema.parse({
        ENV: {
            SPESIA_ENV: process.env['SPESIA_ENV'] as any
        },
        APP: {
            API_GATEWAY_HOST: process.env['API_GATEWAY_HOST'] as any,
            API_GATEWAY_PORT: process.env['API_GATEWAY_PORT'] as any,
            IS_PUBLIC: process.env['IS_PUBLIC'] as any,
            APP_KEY: process.env['APP_KEY'] as any,
            USER_PASSWORD_HASH_ROUNDS: process.env['USER_PASSWORD_HASH_ROUNDS'] as any,
            JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] as any,
            JWT_SECRET: process.env['JWT_SECRET'] as any,
            JWT_REFRESH_SECRET: process.env['JWT_REFRESH_SECRET'] as any,
            JWT_REFRESH_EXPIRES_IN: process.env['JWT_REFRESH_EXPIRES_IN'] as any,
            MASTER_NODE: process.env['MASTER_NODE'] as any,
            THROTTLER_TTL: process.env['THROTTLER_TTL'] as any,
            THROTTLER_LIMIT: process.env['THROTTLER_LIMIT'] as any,
            DEFAULT_LANGUAGE: process.env['DEFAULT_LANGUAGE'] as any,
            I18N_PATH: process.env['I18N_PATH'] as any,
            PROJECT_NAME: process.env['PROJECT_NAME'] as any,
            WEB_HOST: process.env['WEB_HOST'] as any,
            KAFKA_CLIENT_BROKERS: process.env['KAFKA_CLIENT_BROKERS'] as any,
            KAFKA_SSL: process.env['KAFKA_SSL'] as any,
            KAFKA_SASL_USERNAME: process.env['KAFKA_SASL_USERNAME'] as any,
            KAFKA_SASL_PASSWORD: process.env['KAFKA_SASL_PASSWORD'] as any
        },
        MAIL: {
            MAIL_HOST: process.env['MAIL_HOST'] as any,
            MAIL_PORT: process.env['MAIL_PORT'] as any,
            MAIL_SECURE: process.env['MAIL_SECURE'] as any,
            MAIL_USER: process.env['MAIL_USER'] as any,
            MAIL_PASSWORD: process.env['MAIL_PASSWORD'] as any,
            MAIL_FROM_NAME: process.env['MAIL_FROM_NAME'] as any,
            MAIL_FROM_ADDRESS: process.env['MAIL_FROM_ADDRESS'] as any,
            MAIL_TRANSPORT: process.env['MAIL_TRANSPORT'] as any
        },
        DATABASE: {
            DB_HOST: process.env['DB_HOST'] as any,
            DB_TYPE: process.env['DB_TYPE'] as any,
            DB_NAME: process.env['DB_NAME'] as any,
            DB_USERNAME: process.env['DB_USERNAME'] as any,
            DB_PORT: process.env['DB_PORT'] as any,
            DB_PASSWORD: process.env['DB_PASSWORD'] as any,
            DB_SCHEMA: process.env['DB_SCHEMA'] as any,
            DB_LOGGING: process.env['DB_LOGGING'] as any,
            DB_SYNCHRONIZE: process.env['DB_SYNCHRONIZE'] as any,

            REDIS_DB_HOST: process.env['REDIS_DB_HOST'] as any,
            REDIS_DB_PORT: process.env['REDIS_DB_PORT'] as any,
            REDIS_DB_NUM: process.env['REDIS_DB_NUM'] as any,
            REDIS_DB_PASSWORD: process.env['REDIS_DB_PASSWORD'] as any,
            REDIS_DB_KEY_PREFIX: process.env['REDIS_DB_KEY_PREFIX'] as any,
            REDIS_TTL: process.env['REDIS_TTL'] as any
        },
        CLOUD: {
            GCP_BUCKET_NAME: process.env['GCP_BUCKET_NAME'] as any,
            GCP_PROJECT_ID: process.env['GCP_PROJECT_ID'] as any,
            GCP_PRIVATE_KEY_ID: process.env['GCP_PRIVATE_KEY_ID'] as any,
            GCP_PRIVATE_KEY: process.env['GCP_PRIVATE_KEY'] as any,
            GCP_CLIENT_EMAIL: process.env['GCP_CLIENT_EMAIL'] as any,
            GCP_CLIENT_ID: process.env['GCP_CLIENT_ID'] as any,
            GCP_TOKEN_URI: process.env['GCP_TOKEN_URI'] as any,
            GCP_PROVIDER_X509_CERT_URL: process.env['GCP_PROVIDER_X509_CERT_URL'] as any,
            GCP_AUTH_CLIENT_X509_CERT_URL: process.env['GCP_AUTH_CLIENT_X509_CERT_URL'] as any,
            GCP_AUTH_URI: process.env['GCP_AUTH_URI'] as any,
            GCP_CLIENT_SECRET: process.env['GCP_CLIENT_SECRET'] as any,
            GCP_UNIVERSE_DOMAIN: process.env['GCP_UNIVERSE_DOMAIN'] as any
        }
    });
};
