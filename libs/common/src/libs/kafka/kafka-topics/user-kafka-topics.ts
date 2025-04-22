import { UserCreateResponse } from '../../user/dto/user.dto';

export enum UserTopics {
    CreateUser = 'create_user',
    GetUserById = 'get_user_by_id',
    UpdateUser = 'update_user',
    DisableUser = 'disable_user',
    ConfirmAccount = 'ConfirmAccount',
    ResendEmailConfirmation = 'ResendEmailConfirmation'
}

export type UserKafkaMessage = { topic: UserTopics, payload: UserKafkaPayload };

export type UserKafkaPayload =
    | { topic: UserTopics.CreateUser; responseBody: UserCreateResponse }
    | { topic: UserTopics.GetUserById; responseBody: any }
    | { topic: UserTopics.UpdateUser; responseBody: any }
    | { topic: UserTopics.DisableUser; responseBody: any }
    | { topic: UserTopics.ConfirmAccount; responseBody: any }
    | { topic: UserTopics.ResendEmailConfirmation; responseBody: any };
