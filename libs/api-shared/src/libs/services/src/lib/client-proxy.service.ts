import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka, ClientKafkaProxy, ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { catchError, Observable, of, throwError } from 'rxjs';
import { AppConfig, getAppConfig } from '@spesia/common';
import { I18nService } from 'nestjs-i18n';
import { EnvService } from '../../../env/src';

@Injectable()
export class ClientProxyService<T extends 'KAFKA' | 'TCP' = 'KAFKA'> {
    private clients: Map<string, ClientProxy> = new Map();
    private readonly logger = new Logger(ClientProxyService.name);
    private language = this.envService.get('APP').DEFAULT_LANGUAGE;

    public transportType: T = 'KAFKA' as T;

    @Inject()
    private i18n: I18nService;

    constructor(private readonly envService: EnvService) {}


    getOrCreateClient(host: string, port: number, topic: string, overrideTransport?: T): ClientProxy {

        const actualTransportType = overrideTransport || this.transportType;

        const key = `${actualTransportType}:${host}:${port}:${topic}`;
        let client = this.clients.get(key);

        console.log(key);


        if (!client) {
            if (actualTransportType === 'TCP') {
                client = ClientProxyFactory.create({
                    transport: Transport.TCP,
                    options: { host, port }
                });
            } else if (actualTransportType === 'KAFKA') {
                const kafkaClient = ClientProxyFactory.create({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            clientId: topic,
                            brokers: [`${host}:${port}`]
                        },
                        consumer: {
                            groupId: `consumer-${topic}`
                        }
                    }
                });

                if (kafkaClient instanceof ClientKafka) {
                    kafkaClient.subscribeToResponseOf(topic);
                }

                client = kafkaClient as any;
            }

            client?.connect().catch(error => {
                this.logger.error(`Error connecting to service ${topic} at ${host}:${port} using ${overrideTransport}:`, error);
            });

            this.clients.set(key, client as ClientProxy<Record<never, any>, string>);
        }

        return client as ClientProxy;
    }

    send<TResult = any, TInput = any>(topic: string, data: any, service: keyof AppConfig): Observable<TResult> {
        const { host, port } = getAppConfig(service);
        const _host = Array.isArray(host) ? host[0] : host;

        const client = this.getOrCreateClient(_host, +port, topic);
        return client.send<TResult, TInput>(topic, data).pipe(
            catchError(err => {
                this.logger.error(`Error sending message to service ${topic} at ${host}:${port}:`, err);
                return throwError(() => {
                    return err;
                });
            })
        );
    }

    emit<TInput = any>(topic: string, data: any, service: keyof AppConfig): Observable<void> {
        const { host, port } = getAppConfig(service);

        const _host = Array.isArray(host) ? host[0] : host;

        const client = this.getOrCreateClient(_host, port, topic);
        return client.emit<void, TInput>(topic, data).pipe(
            catchError(err => {
                this.logger.error(`Error emitting message to service ${topic} at ${host}:${port}:`, err);
                return throwError(() => err);
            })
        );
    }

    closeClient(host: string, port: number, service: string): void {
        const key = `${host}:${port}:${service}`;
        const client = this.clients.get(key);
        if (client) {
            client.close();
            this.clients.delete(key);
            this.logger.log(`Client for service ${service} at ${host}:${port} closed.`);
        }
    }

    closeAllClients(): void {
        this.clients.forEach((client, key) => {
            client.close();
            this.clients.delete(key);
            this.logger.log(`Client ${key} closed.`);
        });
    }

}
