import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
    UserDto,
    UserCreateResponse,
    UserTopics,
    GetUserByIdDto,
    GetUserByIdResponse,
    ConfirmAccountDto, ResendConfirmationEmailDto
} from '@spesia/common';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @MessagePattern(UserTopics.CreateUser)
    async createUserHandler(@Payload() payload: UserDto): Promise<UserCreateResponse> {
        return this.userService.create(payload);
    }

    @MessagePattern(UserTopics.GetUserById)
    async getById(@Payload() payload: GetUserByIdDto): Promise<GetUserByIdResponse> {
        return this.userService.getById(payload.id);
    }

    @MessagePattern(UserTopics.ConfirmAccount)
    async confirmAccount(@Payload() data: ConfirmAccountDto) {
        await this.userService.confirmAccount(data);
        return true;
    }

    @MessagePattern(UserTopics.ResendEmailConfirmation)
    async resendEmailConfirmation(@Payload() data: ResendConfirmationEmailDto) {
        await this.userService.sendConfirmationEmail(data);
        return true;
    }

}
