import { Global, Module, OnModuleInit } from '@nestjs/common';
import { EmailNotificationClient } from './services/notification-client.service';
import { KafkaModule } from '../../../kafka/src/lib/kafka.module';
import { KafkaService } from '../../../kafka/src';
import { MicroServiceName, NotificationTopics } from '@spesia/common';
import { EmailNotificationUserClient } from './services/notification-user.service';

const SERVICES = [
    EmailNotificationClient,
    EmailNotificationUserClient
]

@Global()
@Module({
    controllers: [],
    providers: [...SERVICES],
    exports: [...SERVICES],
    imports: [
        KafkaModule.register({
            clients: {
                AUTH_SERVICE: {
                    client: {
                        clientId: 'notification',
                        brokers: ['localhost:9092']
                    },
                    consumer: {
                        groupId: 'notification-consumer'
                    }
                }
            }
        }),
    ]
})
export class NotificationClientSharedModule implements OnModuleInit {
    constructor(private readonly kafkaService: KafkaService) {
    }

    async onModuleInit() {
        this.kafkaService.registerSubscriber(MicroServiceName.NOTIFICATION_SERVICE, [
            NotificationTopics.SendEmail,
        ]);
    }
}

