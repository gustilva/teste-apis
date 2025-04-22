import { Module, OnModuleInit } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';
import { AuthTopics, MicroServiceName, NotificationTopics, UserTopics } from '@spesia/common';
import {AuthJwtModule, CoreApiSharedModule, KafkaService} from "@spesia/api-shared";
import {KafkaModule} from "@spesia/api-shared";
import {AuthGuard} from "./guards/auth.guard";
import { KafkaMonitorController } from './kafka-monitor.controller';
import { StorageController } from './storage.controller';

@Module({
    controllers: [AuthController, UserController, KafkaMonitorController,StorageController],
    providers: [AuthGuard],
    imports: [
        CoreApiSharedModule.forRootAsync(),
        KafkaModule.register({
            clients: {
                AUTH_SERVICE: {
                    client: {
                        clientId: 'auth',
                        brokers: ['localhost:9092']
                    },
                    consumer: {
                        groupId: 'auth-consumer'
                    }
                }
            }
        }),
        AuthJwtModule.forRootAsync(),
    ]
})
export class AppModule implements OnModuleInit {
    constructor(private readonly kafkaService: KafkaService) {
    }

    async onModuleInit() {
        this.kafkaService.registerSubscriber(MicroServiceName.AUTH_SERVICE, [
            AuthTopics.Login,
            AuthTopics.Refresh,
            UserTopics.CreateUser
        ]);

        this.kafkaService.registerSubscriber(MicroServiceName.NOTIFICATION_SERVICE, [
           NotificationTopics.SendEmail,
        ]);
    }
}
