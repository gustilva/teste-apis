import { Injectable } from '@nestjs/common';
import { EmailTemplateEntity } from '../entities/email-template.entity';
import { IEmailTemplate } from '@spesia/common';

@Injectable()
export class EmailTemplateMapper {
    toDomain(entity: EmailTemplateEntity): IEmailTemplate {
        return {
            id: entity.id,
            name: entity.name,
            subject: entity.subject,
            body: entity.body,
        };
    }

    toPersistence(domain: IEmailTemplate): EmailTemplateEntity {
        const entity = new EmailTemplateEntity();
        entity.id = domain.id;
        entity.name = domain.name;
        entity.subject = domain.subject;
        entity.body = domain.body;
        return entity;
    }
}
