import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailNotificationEntity } from '../entities/email-notification.entity';
import { EmailStatus, IEmailNotification } from '@spesia/common';
import { EmailNotificationMapper } from '../mappers/email-notification.mapper';

@Injectable()
export class EmailNotificationRepository  {
    constructor(
        @InjectRepository(EmailNotificationEntity)
        private notificationRepository: Repository<EmailNotificationEntity>,
        private mapper: EmailNotificationMapper,
    ) {}

    async findById(id: string): Promise<Partial<Omit<IEmailNotification, "params">>> {
        const entity = await this.notificationRepository.findOne({ where: { id } });
        return entity ? this.mapper.toDomain(entity) : null;
    }


    async findByRecipient(email: string): Promise<Partial<Omit<IEmailNotification, "params">>[]> {
        const entities = await this.notificationRepository.find({
            where: { recipient: { email } }
        });
        return entities.map(entity => this.mapper.toDomain(entity));
    }

    async save(notification: IEmailNotification): Promise<void> {
        const entity = this.mapper.toPersistence(notification);
        await this.notificationRepository.save(entity);
    }

    async update(notification: IEmailNotification): Promise<void> {
        const entity = this.mapper.toPersistence(notification);
        await this.notificationRepository.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.notificationRepository.delete(id);
    }
}
