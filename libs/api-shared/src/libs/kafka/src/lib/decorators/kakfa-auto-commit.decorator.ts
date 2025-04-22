import { ClientKafka, KafkaContext } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('KafkaAutoCommit');
const MAX_RETRY_ATTEMPTS = 5;
const DLQ_TOPIC = 'notification-dlq';

export function KafkaAutoCommit() {
    return function(target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function(...args: any[]) {
            const context = args.find(arg => arg instanceof KafkaContext);
            const kafkaService: ClientKafka = (this as any).kafkaService;

            let retryCount: any = 0;

            try {
                const result = await originalMethod.apply(this, args);

                if (context) {
                    const consumer = context.getConsumer();
                    const message = context.getMessage();
                    const topic = context.getTopic();
                    const partition = context.getPartition();

                    if (consumer && message) {
                        try {
                            retryCount = message?.headers?.['x-retry-count'] ?? 0;

                            if (retryCount < MAX_RETRY_ATTEMPTS) {
                                await consumer.commitOffsets([
                                    {
                                        topic,
                                        partition,
                                        offset: (Number(message.offset) + 1).toString()
                                    }
                                ]);
                                logger.log(`✅ Offset committed: ${message.offset} for topic ${topic}`);
                            } else {
                                await kafkaService.send(DLQ_TOPIC, message);
                                logger.warn(`⚠️ Message moved to DLQ: ${message.offset}`);
                            }
                        } catch (commitError: any) {
                            logger.error(`Error committing offset for message ${message.offset}: ${commitError.message}`);
                            throw commitError;
                        }
                    } else {
                        logger.warn('⚠️ Kafka context or message is missing. No offset commit.');
                    }
                }

                return result;
            } catch (error: any) {
                logger.error(`Error processing Kafka message: ${error.message}`, error.stack);
                throw error;
            }
        };

        return descriptor;
    };
}
