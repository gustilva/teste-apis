
export enum NotificationTopics {
    SendEmail = 'sendEmail',
}

export type NotificationKafkaMessage = { topic: NotificationTopics, payload: NotificationKafkaPayload };

export type NotificationKafkaPayload =
    | { topic: NotificationTopics.SendEmail; responseBody: any }

