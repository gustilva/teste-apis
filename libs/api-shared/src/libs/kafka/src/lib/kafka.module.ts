import { Module, Global, DynamicModule } from '@nestjs/common';
import { ClientKafka, ClientsModule, ClientsModuleOptions, KafkaOptions, Transport } from '@nestjs/microservices';
import { KafkaService } from './services/kafka.service';
import { KafkaMonitorService } from './services/kafka-monitor.service';

export interface KafkaModuleOptions {
    clients: {
        [key: string]: Omit<KafkaOptions['options'], 'transport'>;
    };
}

@Global()
@Module({})
export class KafkaModule {
    static register(options: KafkaModuleOptions): DynamicModule {
        const clients = Object.entries(options.clients).map(([name, config]) => ({
            name,
            transport: Transport.KAFKA,
            options: config,
        }));

        return {
            module: KafkaModule,
            imports: [
                ClientsModule.register(clients as ClientsModuleOptions),
            ],
            providers: [
                KafkaService,
                KafkaMonitorService,
                {
                    provide: 'KAFKA_CLIENTS',
                    useFactory: (...kafkaClients: ClientKafka[]) => {
                        return clients.reduce((acc, client, index) => ({
                            ...acc,
                            [client.name]: kafkaClients[index],
                        }), {});
                    },
                    inject: clients.map(client => client.name),
                },
            ],
            exports: [KafkaService, KafkaMonitorService],
        };
    }

}

