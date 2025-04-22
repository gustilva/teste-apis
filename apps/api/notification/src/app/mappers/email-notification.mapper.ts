import { Injectable } from '@nestjs/common';
import { EmailNotificationEntity } from '../entities/email-notification.entity';
import { IEmailNotification } from '@spesia/common';

@Injectable()
export class EmailNotificationMapper {
    toDomain(entity: EmailNotificationEntity): Partial<Omit<IEmailNotification, 'params'>>  {
        return {
            id: entity.id,
            templateId: entity.templateId,
            recipient: entity.recipient,
            variables: entity.variables,
            sentAt: entity.sentAt || undefined,
            status: entity.status,
            template: undefined
        };
    }

    toPersistence(domain: IEmailNotification): EmailNotificationEntity {
        const entity = new EmailNotificationEntity();
        entity.id = domain.id;
        entity.templateId = domain.templateId;
        entity.recipient = domain.recipient;
        entity.variables = domain.variables;
        entity.sentAt = domain.sentAt || null;
        entity.status = domain.status;
        return entity;
    }
}
