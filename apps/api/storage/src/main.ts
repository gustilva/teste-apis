import { NestFactory } from '@nestjs/core';
import { I18nValidationPipe } from 'nestjs-i18n';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RpcExceptionFilter } from '@spesia/api-shared';
import { GcpModule } from './app/gcp.module';


async function bootstrap() {
    try {
        const app = await NestFactory.create(GcpModule);

        app.connectMicroservice<MicroserviceOptions>({
            transport: Transport.TCP,
            options: {
                host: '0.0.0.0',
                port: 3002,
                retryAttempts: 10,
                retryDelay: 3000,
            }
        });

        app.useGlobalFilters(new RpcExceptionFilter());
        app.useGlobalPipes(new I18nValidationPipe());
        await app.startAllMicroservices();

        app.enableShutdownHooks();

        Logger.debug('[::STORAGE::UP] 💿');
    } catch (error) {
        Logger.error(`Failed to start file storage microservice: ${error.message}`);
        process.exit(1);
    }
}

bootstrap();
