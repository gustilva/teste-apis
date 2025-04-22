import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreApiSharedModule, KafkaService, NotificationClientSharedModule } from '@spesia/api-shared';
import { NotificationController } from './notification.controller';
import { EmailNotificationService } from './services/email-notification.service';
import { EmailNotificationMapper } from './mappers/email-notification.mapper';
import { EmailTemplateMapper } from './mappers/email-template.mapper';
import { EmailTemplateEntity } from './entities/email-template.entity';
import { EmailNotificationEntity } from './entities/email-notification.entity';
import { EmailNotificationRepository } from './repositories/notification.repository';
import { EmailTemplateRepository } from './repositories/template.repository';
import { MicroServiceName, NotificationTopics } from '@spesia/common';

@Module({
    controllers: [NotificationController],
    providers: [
        EmailNotificationService,
        EmailNotificationMapper,
        EmailTemplateMapper,
        EmailTemplateRepository,
        EmailNotificationRepository,
    ],
    imports: [
        TypeOrmModule.forFeature([EmailTemplateEntity, EmailNotificationEntity]),
        CoreApiSharedModule.forRootAsync(),
        NotificationClientSharedModule
    ]
})
export class NotificationModule  implements OnModuleInit {
    constructor(private readonly kafkaService: KafkaService) {
    }

    async onModuleInit() {
        this.kafkaService.registerSubscriber(MicroServiceName.NOTIFICATION_SERVICE, [
            NotificationTopics.SendEmail,
        ]);
    }
}
