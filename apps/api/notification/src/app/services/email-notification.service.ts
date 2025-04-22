import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailNotificationRepository } from '../repositories/notification.repository';
import { EmailStatus, IEmailNotification } from '@spesia/common';
import * as path from 'node:path';
import { EnvService } from '@spesia/api-shared';
import { RpcException } from '@nestjs/microservices';
import { HttpStatusCode } from 'axios';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EmailNotificationService {
    protected defaultVariables: Record<string, string>;

    constructor(
        protected readonly mailerService: MailerService,
        protected readonly notificationRepository: EmailNotificationRepository,
        protected readonly envService: EnvService
    ) {
        this.defaultVariables = {
            projectName: this.envService.get('APP').PROJECT_NAME,
            projectCodeName: this.envService.get('APP').PROJECT_NAME,
            webLogoUrl: `${this.envService.get('APP').WEB_HOST}/assets/logo.png`,
            webAssetsUrl: `${this.envService.get('APP').WEB_HOST}/assets`,
            webUrl: this.envService.get('APP').WEB_HOST,
            apiUrl: this.envService.get('APP').API_GATEWAY_HOST,
            language: this.envService.get('APP').DEFAULT_LANGUAGE,
            currentDate: new Date().getUTCFullYear().toString()
        };
    }

    async sendEmail(payload: IEmailNotification): Promise<void> {

        this.validateEmailNotification(payload);

        payload.id = payload.id || uuidv4();
        payload.variables = {
            ...this.defaultVariables,
            ...payload.variables
        };

        try {

            const emailConfig = {
                to: payload.recipient.name
                    ? `${payload.recipient.name} <${payload.recipient.email}>`
                    : payload.recipient.email,
                subject: payload.params.subject,
                template: this.getTemplatePath(
                    payload.template.folder,
                    payload.templateId,
                    payload.template.handelBarsFileName),
                context: {
                    ...payload.variables
                }
            };

            await this.mailerService.sendMail(emailConfig);
            await this.notificationRepository.update({ ...payload, status: EmailStatus.SENT });

        } catch (error) {
            await this.notificationRepository.update({ ...payload, status: EmailStatus.FAILED });
            throw new RpcException({
                statusCode: HttpStatusCode.BadRequest,
                message: error.message,
                errorCode: 'BAD_REQUEST'
            });
        }
    }

    private validateEmailNotification(payload: IEmailNotification): void {
        if (!payload.recipient.email) {
            throw new RpcException({
                statusCode: HttpStatusCode.NotAcceptable,
                message: 'Recipient email is required',
                errorCode: 'RECIPIENT_EMAIL_REQUIRED'
            });
        }

        if (!payload.recipient.name) {
            throw new RpcException({
                statusCode: HttpStatusCode.NotAcceptable,
                message: 'Recipient name is required',
                errorCode: 'RECIPIENT_NAME_REQUIRED'
            });
        }

        if (!payload.params.subject) {
            throw new RpcException({
                statusCode: HttpStatusCode.NotAcceptable,
                message: 'Subject is required',
                errorCode: 'SUBJECT_NAME_REQUIRED'
            });
        }

        if (!payload.templateId) {
            throw new RpcException({
                statusCode: HttpStatusCode.NotAcceptable,
                message: 'Template Id is required',
                errorCode: 'TEMPLATE_ID_REQUIRED'
            });
        }

        if (!payload.template.folder) {
            throw new RpcException({
                statusCode: HttpStatusCode.NotAcceptable,
                message: 'Template Folder Id is required',
                errorCode: 'TEMPLATE_FOLDER_REQUIRED'
            });
        }

        if (!payload.template.handelBarsFileName) {
            throw new RpcException({
                statusCode: HttpStatusCode.NotAcceptable,
                message: 'Template Handlebars name Id is required',
                errorCode: 'TEMPLATE_HANDLEBARS_REQUIRED'
            });
        }
    }

    private getTemplatePath(entity: string, folder: string, template: string): string {
        return path.join(entity.trim(), folder.trim(), template.trim());
    }

}
