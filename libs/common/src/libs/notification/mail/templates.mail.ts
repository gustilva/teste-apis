/*
* @Author: Ricardo Fagmer
* @Description: Notification Mail Templates, the names refers to the folder name
* so it has to match with the folder name in apps/api/notification/src/app/templates
*/

export enum CoreEmailTemplate {
    WELCOME = 'welcome-email',
    CONFIRMATION_PASSWORD_RESET = 'password-changed',
    CONFIRMATION_ACCOUNT = 'confirmation-account',
    PASSWORD_RESET = 'reset-password',
    ACCOUNT_CONFIRMATION = 'confirm-email',
    ACCOUNT_ALREADY_REGISTERED = 'account-registered',
    CHANGE_EMAIL = 'change-email',
    CHANGE_EMAIL_NOTIFICATION = 'change-email-confirmation',
    DEACTIVATE_ACCOUNT = 'deactivate-account',
    DEACTIVATED_ACCOUNT_CONFIRMATION = 'account-deactivated',
}
