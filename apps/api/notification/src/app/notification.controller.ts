import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { IEmailNotification, NotificationTopics } from '@spesia/common';
import { EmailNotificationService } from './services/email-notification.service';
import { KafkaAutoCommit } from '@spesia/api-shared';

@Controller()
export class NotificationController {
    constructor(private readonly emailNotificationService: EmailNotificationService) {
    }

    @EventPattern(NotificationTopics.SendEmail)
    @KafkaAutoCommit()
    async handleSendEmail(@Payload() notification: IEmailNotification, @Ctx() context: KafkaContext) {
        await this.emailNotificationService.sendEmail(notification);

        /*  if (notification.headers) {
              const retryCount = notification.headers['x-retry-count'] || 0;
              notification.headers['x-retry-count'] = retryCount + 1;
          }*/
    }
}
