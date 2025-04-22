import { Inject, Injectable } from '@nestjs/common';
import { PasswordService } from '../auth/password.service';
import { UserRepository } from './user.repository';
import { ConfirmAccountDto, ResendConfirmationEmailDto, UserDto, UserResponseDto } from '@spesia/common';
import { RpcException } from '@nestjs/microservices';
import { HttpStatusCode } from 'axios';
import { EmailNotificationUserClient, EnvService } from '@spesia/api-shared';
import { v4 as uuidv4 } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly notificationClient: EmailNotificationUserClient,
        private readonly envService: EnvService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {
    }

    async create(request: UserDto): Promise<UserResponseDto> {
        const existingUser = await this.userRepository.findByEmail(request.email);
        if (existingUser) {
            throw new RpcException({
                statusCode: HttpStatusCode.Conflict,
                message: 'Account already exists',
                errorCode: 'USERNAME_EXISTS'
            });
        }

        const password = await this.passwordService.hashPassword(request.password);
        const account = await this.userRepository.createUser({ ...request, password });

        if (account) {
            const token = uuidv4();
            const ttl = this.envService.get('APP').JWT_REFRESH_EXPIRES_IN;

            const cacheKey = `spesiaRefreshToken${account.id}`;
            await this.cacheManager.set(cacheKey, token, +ttl);

            this.notificationClient.sendWelcomeEmail({
                recipient: { email: request.email, name: request.name },
                params: {
                    subject: `Welcome to Spesia ${request.name}`
                },
                variables: {
                    name: request.name,
                    email: request.email,
                    token
                }
            });
        }

        return account;
    }

    async getById(id: number): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new RpcException({
                statusCode: HttpStatusCode.NotFound,
                message: 'Account not found',
                errorCode: 'NOT_FOUND'
            });
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name
        };
    }

    async confirmAccount(request: ConfirmAccountDto): Promise<boolean> {
        const user = await this.userRepository.findByEmail(request.email);

        if (!user) {
            throw new RpcException({
                statusCode: HttpStatusCode.NotFound,
                message: 'Account not found',
                errorCode: 'NOT_FOUND'
            });
        }

        const cacheKey = `spesiaRefreshToken${user.id}`;
        const storedToken = await this.cacheManager.get(cacheKey);

        if (!storedToken || storedToken !== request.token) {
            throw new RpcException({
                statusCode: HttpStatusCode.Unauthorized,
                message: 'Invalid token',
                errorCode: 'INVALID_TOKEN'
            });
        }

        await this.userRepository.updateUser(user.id, { ...user, isConfirmed: true });
        await this.cacheManager.del(cacheKey);

        return true;
    }

    async sendConfirmationEmail(request: ResendConfirmationEmailDto): Promise<void> {
        const user = await this.userRepository.findByEmail(request.email);

        if (!user) {
            throw new RpcException({
                statusCode: HttpStatusCode.NotFound,
                message: 'Account not found',
                errorCode: 'NOT_FOUND'
            });
        }

        await this.emailConfirmation(request);
    }

    async checkAndRenewToken(userId: number) {
        const token = uuidv4();
        const ttl = this.envService.get('APP').JWT_REFRESH_EXPIRES_IN;

        const cacheKey = `spesiaRefreshToken${userId}`;
        await this.cacheManager.set(cacheKey, token, +ttl);

        return {
            ttl,
            token
        };
    }

    async emailConfirmation(payload: ResendConfirmationEmailDto): Promise<string> {
        const { email } = payload;

        const user = await this.userRepository.findByEmail(email);
        const { ttl, token } = await this.checkAndRenewToken(user.id);

        this.notificationClient.sendEmailConfirmation({
            recipient: {
                name: user.name,
                email: user.email
            },
            params: {
                subject: 'Confirm your email',
            },
            variables: {
                userId: user.id,
                name: user.name,
                email: user.email,
                ttl
            }
        }, token);

        return token;
    }
}
