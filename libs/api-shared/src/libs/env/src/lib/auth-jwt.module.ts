import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {EnvService} from "./env.service";
import {EnvModule} from "./env.module";

/**
 * Core JWT Module
 *
 * Configures @nestjs/jwt package to store / generate JWT tokens.
 */

@Module({})
export class AuthJwtModule
{
    static forRootAsync(): DynamicModule {
        return {
            module: AuthJwtModule,
            imports: [
                EnvModule,
                JwtModule.registerAsync({
                    imports: [],
                    inject: [EnvService],
                    useFactory: (env: EnvService) => ({
                        secret: env.get('APP').JWT_SECRET,
                        signOptions: { expiresIn: env.get('APP').JWT_EXPIRES_IN }
                    })
                }),
            ],
            exports: [
                JwtModule,
            ],
        };
    }
}
