import { Transport } from '@nestjs/microservices';

export interface KafkaConfigParams {
    serviceName?: string;
    clientId: string;
    groupId?: string;
    brokers?: string[];
}

export const createKafkaConfig = (config: KafkaConfigParams) => ({
    name: config.serviceName,
    transport: Transport.KAFKA,
    options: {
        client: {
            clientId: config.clientId,
            brokers: config.brokers || ['localhost:9092'],
        },
        consumer: {
            groupId: config.serviceName?.toLowerCase() || config.groupId || `${config.clientId}_consumer`,
            retry: {
                retries: 5,
                initialRetryTime: 300,
            },
            allowAutoTopicCreation: true,
            retryBackoff: 3000,
            autoOffsetReset: 'earliest',
            autoCommit: false,
            sessionTimeout: 30000,
            heartbeatInterval: 10000,
            rebalanceTimeout: 60000,
        },
    },
});

