import { Injectable, Logger } from '@nestjs/common';
import { FileEntity } from '@spesia/api-shared';

export enum FileEventType {
    CREATED = 'file.created',
    DOWNLOADED = 'file.downloaded',
    DELETED = 'file.deleted',
    UPDATED = 'file.updated',
}

export interface FileEvent {
    eventType: FileEventType;
    fileId: string;
    userId?: string;
    fileData: {
        id: string;
        filename: string;
        originalFilename: string;
        mimetype: string;
        size: number;
        isPublic: boolean;
        publicUrl?: string;
        createdAt: Date;
        updatedAt: Date;
    };
    metadata?: Record<string, any>;
    timestamp: number;
}

@Injectable()
export class GcpEventProducer {
    private readonly logger = new Logger(GcpEventProducer.name);
    private readonly topic = 'file-events';


    async emitFileEvent(
        eventType: FileEventType,
        file: FileEntity,
        userId?: string,
        metadata?: Record<string, any>,
    ): Promise<void> {
        try {
            const event: FileEvent = {
                eventType,
                fileId: file.id,
                userId,
                fileData: {
                    id: file.id,
                    filename: file.filename,
                    originalFilename: file.originalFilename,
                    mimetype: file.mimetype,
                    size: file.size,
                    isPublic: file.isPublic,
                    publicUrl: file.publicUrl,
                    createdAt: file.createdAt,
                    updatedAt: file.updatedAt,
                },
                metadata,
                timestamp: Date.now(),
            };

            this.logger.log(`File event ${eventType} emitted for file ${file.id}`);
        } catch (error) {
            this.logger.error(`Failed to emit file event: ${error.message}`, error.stack);
        }
    }
}
