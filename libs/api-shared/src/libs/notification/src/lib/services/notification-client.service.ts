import { Injectable } from '@nestjs/common';
import {
    IEmailNotification,
    NotificationTopics
} from '@spesia/common';
import { ClientProxyService } from '../../../../services/src';
import { EnvService } from '../../../../env/src';

@Injectable()
export class EmailNotificationClient {

    private _clientProxy;

    constructor(private readonly proxyService: ClientProxyService,
                protected readonly envService: EnvService) {

        this._clientProxy = this.proxyService.getOrCreateClient(
            this.envService.get('APP').API_GATEWAY_HOST || 'localhost',
            9092,
            NotificationTopics.SendEmail);
    }

     sendEmail(payload: IEmailNotification) {
         this._clientProxy.emit(NotificationTopics.SendEmail, {
            ...payload
        });
    }
}
