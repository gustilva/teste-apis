import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {catchError, delay, firstValueFrom, Observable, take, throwError} from 'rxjs';

@Injectable()
export class KafkaService {

    private readonly subscribers = new Map<string, string[]>();
    private readonly connectedClients = new Set<string>();

    constructor(@Inject('KAFKA_CLIENTS')
                private readonly kafkaClients: Record<string, ClientKafka>) {
    }

    registerSubscriber(clientName: string, topics: string[]) {
        this.subscribers.set(clientName, topics);
    }

    async connectClient(clientName: string): Promise<void> {
        if (this.connectedClients.has(clientName)) {
            return;
        }

        const client = this.kafkaClients[clientName];
        if (!client) {
            throw new Error(`Client ${clientName} not found`);
        }

        const topics = this.subscribers.get(clientName) || [];
        for (const topic of topics) {
            client.subscribeToResponseOf(topic);
        }

        await client.connect();
        this.connectedClients.add(clientName);
    }

    send<TResult = any, TInput = any>(clientName: string, topic: string, message: TInput): Promise<Observable<TResult>> {
        return this.ensureClientConnection(clientName).then(() => {
            const client = this.kafkaClients[clientName];
            return client.send<TResult, TInput>(topic, message)
                .pipe(
                    delay(5000),
                    take(3),
                    catchError(err => {
                        Logger.error(`Error sending message to topic ${topic}: ${JSON.stringify(err)}`);
                        return throwError(err);
                    })
                );
        });
    }

    async sendAsync<TResult = any, TInput = any>(
        clientName: string,
        topic: string,
        message: TInput
    ): Promise<TResult> {
        return firstValueFrom(await this.send<TResult, TInput>(clientName, topic, message));
    }

    emit<TInput = any>(
        clientName: string,
        topic: string,
        message: TInput
    ): void {
        this.ensureClientConnection(clientName).then(() => {
            const client = this.kafkaClients[clientName];
            return client.emit<void, TInput>(topic, message)
                .pipe(catchError(err => {
                    Logger.error(`Error emitting message to topic ${topic}: ${JSON.stringify(err)}`);
                    return throwError(err);
                }));
        });
    }

    private async ensureClientConnection(clientName: string): Promise<void> {
        if (!this.connectedClients.has(clientName)) {
            await this.connectClient(clientName);
        }
    }
}
