import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AllExceptionsFilter, HttpExceptionFilter } from '@spesia/api-shared';
import { I18nValidationPipe } from 'nestjs-i18n';
import { Logger } from '@nestjs/common';

async function bootstrap() {

    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

    app.enableCors();

    app.useGlobalPipes(new I18nValidationPipe());

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: { host: '0.0.0.0', port: 4001 }
    });

    await app.startAllMicroservices();
    await app.listen(3000);
    Logger.verbose(`[::API GATEWAY::] Running on ${3000}✅`);

}bootstrap();
