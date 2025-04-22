import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    APP_SERVICE,
    ConfirmAccountDto,
    CoreOpenApiTags,
    GetUserByIdDto,
    ResendConfirmationEmailDto,
    UserDto,
    UserTopics
} from '@spesia/common';
import {ClientProxyService, UserEndpointPaths} from "@spesia/api-shared";
import { AuthGuard } from './guards/auth.guard';

@ApiTags(CoreOpenApiTags.User)
//@UseGuards(AuthGuard)
@Controller()
export class UserController  {
    constructor(private readonly proxyService: ClientProxyService) {}

    @Post(UserEndpointPaths.CreateUser)
    async register(@Body() request: UserDto) {
        return this.proxyService.send(UserTopics.CreateUser, request, APP_SERVICE.USER);
    }

    @Get(UserEndpointPaths.GetUserById)
    async getUserById(@Param('id') request: GetUserByIdDto) {
        return this.proxyService.send(UserTopics.GetUserById, request, APP_SERVICE.USER);
    }

    @Post(UserEndpointPaths.ConfirmAccount)
    async confirmAccount(@Body() request: ConfirmAccountDto) {
        return this.proxyService.send(UserTopics.ConfirmAccount, request, APP_SERVICE.USER);
    }

    @Post(UserEndpointPaths.ResendCofirmationEmails)
    async resendConfirmationEmail(@Body() request: ResendConfirmationEmailDto) {
        return this.proxyService.send(UserTopics.ResendEmailConfirmation, request, APP_SERVICE.USER);
    }

}
