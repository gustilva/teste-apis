
export enum AuthTopics {
    Login = 'Login',
    Refresh = 'Refresh',
    Logout = 'Logout',
    ResetPassword = 'ResetPassword',
    ConfirmResetPassword = 'ConfirmResetPassword',
}

export type AuthKafkaPayload =
    | { topic: AuthTopics.Login; responseBody: any }
    | { topic: AuthTopics.Refresh; responseBody: any }
    | { topic: AuthTopics.Logout; responseBody: any }
    | { topic: AuthTopics.ResetPassword; responseBody: any }
    | { topic: AuthTopics.ConfirmResetPassword; responseBody: any }

