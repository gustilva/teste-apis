export interface NotificationPayload {
    userId: string;
    type: 'welcome' | 'logout' | 'custom';
    data?: Record<string, any>;
    lang?: string;
}
