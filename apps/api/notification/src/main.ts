import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './app/notification.module';
import { MicroServiceName } from '@spesia/common';
import { RpcExceptionFilter } from '@spesia/api-shared';
import { I18nValidationPipe } from 'nestjs-i18n';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {

    const app = await NestFactory.createMicroservice(
        NotificationModule, {
            name: MicroServiceName.NOTIFICATION_SERVICE,
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: 'notification',
                    brokers: [process.env.KAFKA_CLIENT_BROKERS || '127.0.0.1:9092']
                },
                consumer: {
                    groupId: 'notification-consumer',
                    retry: {
                        retries: 5,
                        initialRetryTime: 30,
                        maxRetryTime: 100000
                    },
                    allowAutoTopicCreation: true,
                    autoOffsetReset: 'earliest',
                    autoCommit: false,
                    sessionTimeout: 30000,
                    rebalanceTimeout: 60000,
                }
            }
        });

    app.useGlobalFilters(new RpcExceptionFilter());
    app.useGlobalPipes(new I18nValidationPipe());

    app.enableShutdownHooks();

    await app.listen();
    Logger.debug('[::NOTIFICATION::UP] 📩');

}

bootstrap();
