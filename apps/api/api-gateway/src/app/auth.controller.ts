import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
    APP_SERVICE,
    AuthTopics, ConfirmPasswordDto,
    CoreOpenApiTags,
    LoginDto, LogoutDto,
    RefreshTokenDto, ResetPasswordDto
} from '@spesia/common';
import { AuthEndpointPaths, ClientProxyService, TCP_CLIENT_PROXY } from '@spesia/api-shared';
import { AuthGuard } from './guards/auth.guard';

@ApiTags(CoreOpenApiTags.Auth)
@Controller()
export class AuthController {

    constructor(
        @Inject(TCP_CLIENT_PROXY)
        private proxyService: ClientProxyService<'TCP'>) {
    }

    @ApiOkResponse()
    @Post(AuthEndpointPaths.Login)
    async login(@Body() request: LoginDto) {
        return this.proxyService.send(AuthTopics.Login, request, APP_SERVICE.AUTH);
    }

    //@UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse()
    @Post(AuthEndpointPaths.Refresh)
    async refresh(@Body() request: RefreshTokenDto) {
        return this.proxyService.send(AuthTopics.Refresh, request, APP_SERVICE.AUTH);
    }

    //@UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse()
    @Post(AuthEndpointPaths.Logout)
    async logout(@Body() request: LogoutDto) {
        return this.proxyService.send(AuthTopics.Logout, request, APP_SERVICE.AUTH);
    }

    //@UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse()
    @Post(AuthEndpointPaths.ResetPassword)
    resetPassword(@Body() request: ResetPasswordDto) {
        return this.proxyService.send(AuthTopics.ResetPassword, request, APP_SERVICE.AUTH);
    }

    @ApiOkResponse({
        description: 'Confirms the reset password request.',
    })
    @Post(AuthEndpointPaths.ConfirmResetPassword)
     confirmResetPassword(@Body() request: ConfirmPasswordDto) {
        return this.proxyService.send(AuthTopics.ConfirmResetPassword, request, APP_SERVICE.AUTH);
    }

}
