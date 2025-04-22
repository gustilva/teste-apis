import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
    AuthTopics,
    ConfirmAccountDto,
    ConfirmPasswordDto,
    LoginDto,
    LogoutDto,
    RefreshTokenDto,
    ResetPasswordDto
} from '@spesia/common';

@Controller()
export class AuthController {

    constructor(private readonly service: AuthService) {
    }

    @MessagePattern(AuthTopics.Login)
    async login(@Payload() data: LoginDto) {
        return await this.service.login(data);
    }

    @MessagePattern(AuthTopics.Refresh)
    async refresh(@Payload() data: RefreshTokenDto) {
        return await this.service.refreshAccessToken(data);
    }

    @MessagePattern(AuthTopics.Logout)
    async logout(@Payload() data: LogoutDto) {
        return await this.service.logout(data);
    }

    @MessagePattern(AuthTopics.ResetPassword)
    async resetPassword(@Payload() email: ResetPasswordDto) {
        await this.service.resetPassword(email);
        return true;
    }

    @MessagePattern(AuthTopics.ConfirmResetPassword)
    async confirmPassword(@Payload() data: ConfirmPasswordDto) {
        await this.service.confirmPasswordReset(data);
        return true;
    }

}
