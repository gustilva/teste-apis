import { DynamicModule, Global, Module, OnModuleInit } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserRepository } from '../user/user.repository';
import { PasswordService } from './password.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../user/user.controller';
import {
    AuthJwtModule,
    CoreApiSharedModule,
    KafkaModule,
    KafkaService,
    NotificationClientSharedModule, UserEntity
} from '@spesia/api-shared';
import { MicroServiceName, NotificationTopics } from '@spesia/common';


@Global()
@Module({})
export class AuthModule implements OnModuleInit {
    constructor(private readonly kafkaService: KafkaService) {}

    static forRootAsync(): DynamicModule {
        return {
            module: AuthModule,
            controllers: [AuthController, UserController],
            providers: [UserRepository, PasswordService, UserService, AuthService],
            exports: [PasswordService, UserService, UserRepository],
            imports: [
                TypeOrmModule.forFeature([UserEntity]),
                CoreApiSharedModule.forRootAsync(),
                AuthJwtModule.forRootAsync(),
                NotificationClientSharedModule,
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
        };
    }

    onModuleInit(): any {
            this.kafkaService.registerSubscriber(MicroServiceName.NOTIFICATION_SERVICE, [
            NotificationTopics.SendEmail,
        ]);
    }
}
