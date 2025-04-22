import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpStatusCode } from 'axios';
import {
    ConfirmPasswordDto,
    LoginDto,
    LogoutDto,
    RefreshTokenDto,
    RefreshTokenResponse,
    ResetPasswordDto,
} from '@spesia/common';
import { I18nService } from 'nestjs-i18n';
import { EmailNotificationUserClient, EnvService, UserEntity } from '@spesia/api-shared';

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository,
                private readonly jwtService: JwtService,
                private readonly envService: EnvService,
                @Inject(CACHE_MANAGER) private cacheManager: Cache,
                private i18n: I18nService,
                private readonly emailService: EmailNotificationUserClient
    ) {}

    async validateUser(payload: LoginDto): Promise<Omit<UserEntity, "password">> {
        const user = await this.userRepository.findByEmail(payload.email);

        if (!user) return null;

        const isMatch = await bcrypt.compare(payload.password, user.password);

        return isMatch ? user : null;
    }

    async login(payload: LoginDto) {
        const user = await this.validateUser(payload);

        if (!user) throw new RpcException({
            message: this.i18n.translate('common.auth.errors.invalidCredentials'),
            errorCode: 'INVALID_CREDENTIALS',
            statusCode: HttpStatusCode.Unauthorized,
            error: 'Unauthorized',
        });

        if(!user.isConfirmed) throw new RpcException({
          message: this.i18n.translate('common.user.notification.errors.accountNotConfirmed'),
          errorCode: 'ACCOUNT_NOT_CONFIRMED',
          statusCode: HttpStatusCode.Locked
        });

        const refreshToken = this.generateRefreshToken();
        const rest = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(rest);

        const ttl = this.envService.get('APP').JWT_REFRESH_EXPIRES_IN;
        await this.cacheManager.set(`spesiaRefreshToken:${user.id}`, refreshToken, +ttl);

        return {
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            userRole: user.role,
            accessToken,
            refreshToken
        };
    }

    generateRefreshToken(): string {
        return uuidv4();
    }


    async refreshAccessToken(payload: RefreshTokenDto): Promise<RefreshTokenResponse> {
        const storedRefreshToken = await this.cacheManager.get(`spesiaRefreshToken:${payload.userId}`);

        if (!storedRefreshToken || storedRefreshToken !== payload.refreshToken) {
            throw new RpcException({
                statusCode: HttpStatusCode.Unauthorized,
                message: this.i18n.t('common.auth.errors.invalidToken'),
                errorCode: 'INVALID_REFRESH_TOKEN'
            });
        }

        const user = await this.userRepository.findById(payload.userId);
        if (!user) {
            throw new RpcException({
                statusCode: HttpStatusCode.NotFound,
                message: this.i18n.t('common.auth.errors.notFoundWithId', {
                    args: {
                        id: payload.userId
                    }
                }),
                errorCode: 'USER_NOT_FOUND'
            });
        }

        const rest = { username: user.name, sub: user.id };
        const accessToken = this.jwtService.sign(rest);

        return { accessToken };
    }

    async logout(payload: LogoutDto): Promise<void> {
        const cacheKey = `spesiaRefreshToken:${payload.userId}`;

        const storedRefreshToken = await this.cacheManager.get(cacheKey);

        if (!storedRefreshToken) {
            throw new RpcException({
                statusCode: HttpStatusCode.NotFound,
                message: this.i18n.t('common.auth.errors.invalidRefreshToken'),
                errorCode: 'REFRESH_TOKEN_NOT_FOUND'
            });
        }

        await this.cacheManager.del(cacheKey);
    }

    async resetPassword({ email }: ResetPasswordDto): Promise<void> {
        const user = await this.userRepository.findByEmail(email);

        await this.cacheManager.del(`spesiaRefreshToken:${user.id}`);

        if (!user) {
            throw new RpcException({
                statusCode: HttpStatusCode.NotFound,
                message: this.i18n.t('common.auth.errors.userNotFound', {
                    args: { email }
                }),
                errorCode: 'USER_NOT_FOUND'
            });
        }

        const resetToken = uuidv4();
        const ttl = this.envService.get('APP').JWT_REFRESH_EXPIRES_IN;

        const cacheKey = `spesiaRefreshToken${user.id}`;
        await this.cacheManager.set(cacheKey, resetToken, +ttl);

        this.emailService.sendPasswordReset({
            recipient: {
                name: user.name,
                email: user.email
            },
            variables: {
                userId: user.id,
                name: user.name,
                email: user.email,
                ttl
            }
        }, resetToken);

    }

    async confirmPasswordReset(payload: ConfirmPasswordDto): Promise<void> {
        const { userId, token, newPassword } = payload;

        const cacheKey = `spesiaRefreshToken${userId}`;
        const storedToken = await this.cacheManager.get(cacheKey);

        if (!storedToken || storedToken !== token) {
            throw new RpcException({
                statusCode: HttpStatusCode.Unauthorized,
                message: this.i18n.t('common.auth.errors.invalidResetToken'),
                errorCode: 'INVALID_RESET_TOKEN'
            });
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new RpcException({
                statusCode: HttpStatusCode.NotFound,
                message: this.i18n.t('common.auth.errors.notFoundWithId', {
                    args: { id: userId }
                }),
                errorCode: 'USER_NOT_FOUND'
            });
        }

        const password = await bcrypt.hash(newPassword, 10);
        await this.userRepository.updateUser(userId, { ...user, password });

        await this.cacheManager.del(cacheKey);

        this.emailService.sendConfirmationPasswordReset({
            recipient: {
                name: user.name,
                email: user.email
            },
            params: {
                subject: 'Confirmation of password reset',
            },
            variables: {
                name: user.name,
                email: user.email
            }
        });
    }

}
