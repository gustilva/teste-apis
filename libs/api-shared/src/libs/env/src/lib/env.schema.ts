import { z } from 'zod';

export const EnvironmentSchema = z.object({
    SPESIA_ENV: z.enum(['test', 'development', 'production'])
});

export const DataBaseSchema = z.object({
    DB_HOST: z.string(),
    DB_TYPE: z
        .enum(['mysql', 'postgres', 'mariadb', 'sqlite', 'mssql'])
        .default('mysql'),
    DB_NAME: z.string(),
    DB_USERNAME: z.string(),
    DB_PORT: z.coerce.number(),
    DB_PASSWORD: z.string(),
    DB_LOGGING: z.string(),
    DB_SYNCHRONIZE: z.string(),
    DB_SCHEMA: z.string(),
    REDIS_DB_HOST: z.string(),
    REDIS_DB_PORT: z.coerce.number().positive().int().default(6379),
    REDIS_DB_NUM: z.coerce.number().positive().int().default(1),
    REDIS_DB_PASSWORD: z.string(),
    REDIS_DB_KEY_PREFIX: z.string().optional(),
    REDIS_TTL: z.string().default('30d')
});

export const appSchema = z.object({
    API_GATEWAY_HOST: z.string().default('localhost'),
    PROJECT_NAME: z.string().default('spesiaonc'),
    WEB_HOST: z.string().default('localhost'),
    API_GATEWAY_PORT: z.coerce.number().positive().int().default(3000),
    IS_PUBLIC: z.coerce.boolean().optional().default(true),
    APP_KEY: z.string(),
    USER_PASSWORD_HASH_ROUNDS: z.coerce.number().positive().int().default(12),
    JWT_EXPIRES_IN: z.string().default('4days'),
    JWT_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.string().default('4days'),
    DEFAULT_LANGUAGE: z.string().default('en'),
    I18N_PATH: z.string(),
    MASTER_NODE: z.coerce.boolean().default(false),
    THROTTLER_TTL: z.coerce.number().positive().int().default(60),
    THROTTLER_LIMIT: z.coerce.number().positive().int().default(65535),
    KAFKA_CLIENT_BROKERS: z.coerce.string(z.string()).default('localhost:9092'),
    KAFKA_SSL: z.coerce.boolean().default(false),
    KAFKA_SASL_USERNAME: z.string(),
    KAFKA_SASL_PASSWORD: z.string()
});

export const mailSchema = z.object({
    MAIL_HOST: z.string(),
    MAIL_PORT: z.coerce.number().positive().int().default(587),
    MAIL_SECURE: z.coerce.boolean().default(true),
    MAIL_USER: z.string(),
    MAIL_PASSWORD: z.string(),
    MAIL_FROM_NAME: z.string(),
    MAIL_FROM_ADDRESS: z.string(),
    MAIL_TRANSPORT: z.string()
});

export const cloudSchema = z.object({
    GCP_BUCKET_NAME: z.string(),
    GCP_PROJECT_ID: z.string(),
    GCP_PRIVATE_KEY_ID: z.string(),
    GCP_PRIVATE_KEY: z.string(),
    GCP_CLIENT_EMAIL: z.string(),
    GCP_CLIENT_ID: z.string(),
    GCP_TOKEN_URI: z.string(),
    GCP_PROVIDER_X509_CERT_URL: z.string(),
    GCP_AUTH_CLIENT_X509_CERT_URL: z.string(),
    GCP_AUTH_URI: z.string(),
    GCP_CLIENT_SECRET: z.string(),
    GCP_UNIVERSE_DOMAIN: z.string()
});


export const configSchema = z.object({
    ENV: EnvironmentSchema,
    APP: appSchema,
    DATABASE: DataBaseSchema,
    MAIL: mailSchema,
    CLOUD: cloudSchema
});

export type Env = z.infer<typeof configSchema>;
