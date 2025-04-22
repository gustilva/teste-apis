
export enum UserEndpointPaths {
    CreateUser = '/user/create',
    UpdateUser = '/user/update',
    DisableUser = '/user/disable',
    GetUserById = '/user/getById/:id',
    ConfirmAccount = '/user/confirm-account',
    ResendCofirmationEmails = '/user/resend-confirmation-email',
}

export enum AuthEndpointPaths {
    Login = '/auth/login',
    Refresh = '/auth/refresh',
    Logout = '/auth/logout',
    ResetPassword = '/auth/reset-password',
    ConfirmResetPassword = '/auth/confirm-reset-password',
}
