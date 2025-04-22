export interface IEmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
}

export interface IEmailRecipient {
    email: string;
    name?: string;
}

export interface IEmailNotification {
    id?: string;
    templateId?: string;
    recipient: IEmailRecipient;
    params?: EmailSendParams,
    variables?: Record<string, any>;
    sentAt?: Date;
    status?: EmailStatus;
    template?: {
        folder: string,
        handelBarsFileName: string
    };
}

export enum EmailStatus {
    PENDING = 'pending',
    SENT = 'sent',
    FAILED = 'failed',
}


export interface EmailSendParams {
    to?: IEmailRecipient;
    subject?: string;
    body?: string;
}
