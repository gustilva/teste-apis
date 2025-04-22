import { Controller, UseGuards } from '@nestjs/common';
import { GcpFileStorageService } from './gcp-file-storage.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { FileStorageTopics, StorageBodyDto, StorageUploadFileDto } from '@spesia/common';
import { GCSAuthGuard, KafkaAutoCommit } from '@spesia/api-shared';

@Controller()
export class GcsController {
    constructor(private readonly gcpFileStorage: GcpFileStorageService) { }

    @MessagePattern(FileStorageTopics.Buckets)
    @KafkaAutoCommit()
    @UseGuards(GCSAuthGuard)
    async callback() {
        return await this.gcpFileStorage.listBuckets();
    }

    @MessagePattern(FileStorageTopics.GetSignedUrl)
    @KafkaAutoCommit()
    async signedUrl(@Payload() payload: StorageBodyDto) {
        return await this.gcpFileStorage.getSignedUrl(payload);
    }

    @EventPattern(FileStorageTopics.DeleteFile)
    @KafkaAutoCommit()
    async remove(@Payload() payload: StorageBodyDto) {
        await this.gcpFileStorage.deleteFile(payload);
    }


    @MessagePattern(FileStorageTopics.DownloadBuffer)
    @KafkaAutoCommit()
    async downloadBuffer(@Payload() payload: StorageBodyDto) {
        return await this.gcpFileStorage.getFileBuffer(payload);
    }

    @MessagePattern(FileStorageTopics.DownloadFile)
    @KafkaAutoCommit()
    async downloadFile(@Payload() payload: StorageBodyDto) {
        return await this.gcpFileStorage.downloadFile(payload);
    }

    @MessagePattern(FileStorageTopics.UploadFile)
    @KafkaAutoCommit()
    @UseGuards(GCSAuthGuard)
    async uploadFile(@Payload() payload: StorageUploadFileDto) {
        const { file, isPublic, folder, userId } = payload;

        const fileBuffer = Buffer.from(file.buffer);

        const fileObject = {
            ...file,
            buffer: fileBuffer
        };

        return await this.gcpFileStorage.uploadFile(
            fileObject,
            userId,
            isPublic,
            folder
        );
    }


}
