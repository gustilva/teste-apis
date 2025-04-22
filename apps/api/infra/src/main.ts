import { NestFactory } from '@nestjs/core';
import { InfraModule } from './app/infra.module';
import { MicroServiceName } from '@spesia/common';
import { createKafkaConfig } from '@spesia/api-shared';

async function bootstrap() {

    const app = await NestFactory.createMicroservice(
        InfraModule,
        createKafkaConfig({
            serviceName: MicroServiceName.INFRA_SERVICE,
            clientId: 'infra',
            groupId: 'infra-consumer'
        }));

    await app.listen();
    console.log('Infra Microservice is listening');

}

bootstrap();
