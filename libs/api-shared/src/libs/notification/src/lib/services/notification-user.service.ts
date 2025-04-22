import { Injectable } from '@nestjs/common';
import {
    CoreEmailTemplate,
    IEmailNotification
} from '@spesia/common';
import { EmailNotificationClient } from './notification-client.service';

@Injectable()
export class EmailNotificationUserClient extends EmailNotificationClient {

    sendWelcomeEmail(request: IEmailNotification) {

        this.sendEmail({
            templateId: CoreEmailTemplate.WELCOME,
            template: { folder: 'user', handelBarsFileName: 'welcome-email.html.hbs' },
            recipient: {
                email: request.recipient.email,
                name: request.recipient.name
            },
            params: {
                subject: `Welcome to Spesia ${request.recipient.name}`,
            },
            variables: {
                ...request.variables,
                link: this.buildURL(request.recipient.email, request.variables?.['token'], request.variables?.['userId'])
            }
        });
    }

    sendEmailConfirmation(request: IEmailNotification, token: string) {
        this.sendEmail({
            templateId: CoreEmailTemplate.ACCOUNT_CONFIRMATION,
            template: { folder: 'user', handelBarsFileName: 'confirm-email.html.hbs' },
            recipient: {
                email: request.recipient.email,
                name: request.recipient.name
            },
            params: {
                subject: `Email confirmation for ${request.recipient.email}`,
            },
            variables: {
                ...request.variables,
                link: this.buildURL(request.recipient.email, token, request.variables?.['userId'])
            }
        });
    }

    sendPasswordReset(request: IEmailNotification, resetToken: string) {

        this.sendEmail({
            templateId: CoreEmailTemplate.PASSWORD_RESET,
            template: { folder: 'user', handelBarsFileName: 'reset-password.html.hbs' },
            recipient: {
                email: request.recipient.email,
                name: request.recipient.name
            },
            params: {
                subject: `Request password reset for ${request.recipient.email}`,
            },
            variables: {
                ...request.variables,
                resetUrl: `${this.envService.get('APP')?.WEB_HOST}/#/change-password?id=${request.variables?.['userId']}&token=${resetToken}`
            }
        });
    }

    sendConfirmationPasswordReset(request: IEmailNotification) {
        this.sendEmail({
            templateId: CoreEmailTemplate.CONFIRMATION_PASSWORD_RESET,
            template: { folder: 'user', handelBarsFileName: 'password-changed.html.hbs' },
            recipient: {
                email: request.recipient.email,
                name: request.recipient.name
            },
            params: {
            subject: `Password reset confirmation for ${request.recipient.email}`,
        },
            variables: {
                ...request.variables
            }
        });
    }

    buildURL(email: string, token: string, userId: number) {
        const emailEncoded = this.encodeEmail(email);
        return `${this.envService.get('APP')?.WEB_HOST}/#/account-confirmation?email=${emailEncoded}&id=${userId}&token=${token}`;
    }

    encodeEmail(email: string) {
        return encodeURIComponent(email);
    }

}
