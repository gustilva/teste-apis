interface ServiceConfig {
    host: string | string[];
    port: number;
}

export interface AppConfig {
    AUTH: ServiceConfig;
    USER: ServiceConfig;
    INFRA: ServiceConfig;
    NOTIFICATION: ServiceConfig;
    FILE_STORAGE: ServiceConfig;
}

export enum APP_SERVICE {
    AUTH = 'AUTH',
    USER = 'USER',
    NOTIFICATION = 'NOTIFICATION',
    INFRA = 'INFRA',
    FILE_STORAGE = 'FILE_STORAGE',
}

const DEFAULT_HOST = process.env['DEFAULT_HOST'] || '0.0.0.0';
const DEFAULT_PORT_AUTH = process.env['DEFAULT_PORT'] || 3001;
const DEFAULT_PORT_STORAGE = process.env['DEFAULT_PORT'] || 3002;

const DEFAULT_KAFKA_BROKER = [process.env['KAFKA_CLIENT_BROKERS'] || '127.0.0.1:9092'];
const DEFAULT_KAFKA_PORT = 9092;

export const APP_CONFIG: AppConfig = {
    AUTH: {
        host: process.env['AUTH_HOST'] || DEFAULT_HOST,
        port: Number(process.env['AUTH_PORT'] || DEFAULT_PORT_AUTH)
    },
    USER: {
        host: process.env['USER_HOST'] || DEFAULT_HOST,
        port: Number(process.env['AUTH_PORT'] || DEFAULT_PORT_AUTH)
    },
    INFRA: {
        host: process.env['INFRA_HOST'] || DEFAULT_HOST,
        port: Number(process.env['AUTH_PORT'] || DEFAULT_PORT_AUTH)
    },
    NOTIFICATION: {
        host: DEFAULT_KAFKA_BROKER,
        port: DEFAULT_KAFKA_PORT
    },
    FILE_STORAGE: {
        //host: DEFAULT_KAFKA_BROKER[0].substring(0, DEFAULT_KAFKA_BROKER[0].indexOf(':')),
        host: process.env['INFRA_HOST'] || DEFAULT_HOST,
        port: Number(process.env['AUTH_PORT'] || DEFAULT_PORT_STORAGE)
    }
};

export const getAppConfig = (app: keyof AppConfig) => {
    return APP_CONFIG[app];
};



