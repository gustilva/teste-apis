import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer, Producer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaMonitorService implements OnModuleInit {
    private kafka: Kafka;
    private consumer: Consumer;
    private producer: Producer;
    private messages: { key: string; value: string; offset: string }[] = [];

    constructor() {
        this.kafka = new Kafka({
            clientId: 'kafka-monitor',
            brokers: [process.env['KAFKA_CLIENT_BROKERS'] || 'localhost:9092'] ,
        });
        this.consumer = this.kafka.consumer({ groupId: 'kafka-monitor-group' });
        this.producer = this.kafka.producer();
    }

    async onModuleInit() {
        await this.producer.connect();
        await this.consumer.connect();
        await this.consumeMessages('sendEmail');
    }

    async consumeMessages(topic: string) {
        await this.consumer.subscribe({ topic, fromBeginning: true });
        await this.consumer.run({
            eachMessage: async ({ message }: EachMessagePayload) => {
                this.messages.push({
                    key: message.key?.toString() || 'null',
                    value: message.value?.toString() || 'null',
                    offset: message.offset,
                });
            },
        });
    }

    getMessages() {
        return this.messages;
    }

    async editMessage(topic: string, key: string, newValue: string) {
        await this.producer.send({
            topic,
            messages: [{ key, value: newValue }],
        });
        const msg = this.messages.find((m) => m.key === key);
        if (msg) msg.value = newValue;
    }

    async removeMessage(topic: string, key: string) {
        await this.producer.send({
            topic,
            messages: [{ key, value: null }],
        });
        this.messages = this.messages.filter((m) => m.key !== key);
    }
}
