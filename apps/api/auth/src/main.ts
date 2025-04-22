import { NestFactory } from '@nestjs/core';
import { AuthModule } from './app/auth/auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RpcExceptionFilter} from "@spesia/api-shared";
import { I18nValidationPipe } from 'nestjs-i18n';
import { Logger } from '@nestjs/common';

async function bootstrap() {

    const app = await NestFactory.create(AuthModule.forRootAsync());

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: {
            host: '0.0.0.0',
            port: 3001
        }
    });


    app.useGlobalFilters(new RpcExceptionFilter());
    app.useGlobalPipes(new I18nValidationPipe());
    await app.startAllMicroservices();

    app.enableShutdownHooks();


    Logger.debug('[::AUTHENTICATION::UP] 🔐');

}

bootstrap();
