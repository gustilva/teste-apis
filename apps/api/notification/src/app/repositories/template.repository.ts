import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplateEntity } from '../entities/email-template.entity';
import { IEmailTemplate } from '@spesia/common';
import { EmailTemplateMapper } from '../mappers/email-template.mapper';

@Injectable()
export class EmailTemplateRepository {
    constructor(
        @InjectRepository(EmailTemplateEntity)
        private templateRepository: Repository<EmailTemplateEntity>,
        private mapper: EmailTemplateMapper,
    ) {}

    async findById(id: string): Promise<IEmailTemplate> {
        const entity = await this.templateRepository.findOne({ where: { id } });
        return this.mapper.toDomain(entity);
    }

    async findByName(name: string): Promise<IEmailTemplate | null> {
        const entity = await this.templateRepository.findOne({ where: { name } });
        return entity ? this.mapper.toDomain(entity) : null;
    }

    async findAll(): Promise<IEmailTemplate[]> {
        const entities = await this.templateRepository.find();
        return entities.map(entity => this.mapper.toDomain(entity));
    }

    async save(template: IEmailTemplate): Promise<void> {
        const entity = this.mapper.toPersistence(template);
        await this.templateRepository.save(entity);
    }

    async update(template: IEmailTemplate): Promise<void> {
        const entity = this.mapper.toPersistence(template);
        await this.templateRepository.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.templateRepository.delete(id);
    }
}
