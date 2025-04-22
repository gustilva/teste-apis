import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EnvService, FileEntity, GCP_STORAGE } from '@spesia/api-shared';
import { InjectRepository } from '@nestjs/typeorm';
import { GcpEventProducer, FileEventType } from './gcp-event.producer';
import { Repository } from 'typeorm';
import { File as GCSFile, Storage } from '@google-cloud/storage';
import { FileResponseDto, MulterFile, StorageBodyDto } from '@spesia/common';
import * as crypto from 'node:crypto';
import * as path from 'node:path';

const MAX_FILE_NAME_LENGTH = 255;

@Injectable()
export class GcpFileStorageService {
    private readonly logger = new Logger(GcpFileStorageService.name);
    private readonly bucketName: string;

    constructor(
        @InjectRepository(FileEntity)
        private readonly fileRepository: Repository<FileEntity>,
        private readonly envService: EnvService,
        private readonly fileEventProducer: GcpEventProducer,
        @Inject(GCP_STORAGE) private readonly storage: Storage

    ) {
        const cloudConfig = this.envService.get('CLOUD');
        this.bucketName = cloudConfig.GCP_BUCKET_NAME;
    }

    async listBuckets(): Promise<string[]> {
        try {
            const [buckets] = await this.storage.getBuckets();
            return buckets.map(bucket => bucket.name);
        } catch (error) {
            this.logger.error( `${error.message}`, error.stack);
            throw new BadRequestException(`Failed to list buckets: ${error.message}`);
        }
    }

    async uploadFile(
        file: MulterFile,
        userId?: string | number,
        isPublic = false,
        folder = 'assets'
    ): Promise<FileResponseDto> {
        if (!file) throw new BadRequestException('No file provided');
        if (file.size > 15 * 1024 * 1024) throw new BadRequestException('File too large');

        if (!['image/jpeg', 'text/plain', 'application/pdf', 'application/vnd.ms-excel'].includes(file.mimetype)) {
            throw new BadRequestException('Unsupported file type');
        }

        folder = folder.replace(/[^a-zA-Z0-9-_/]/g, '');
        if (folder.length > MAX_FILE_NAME_LENGTH) {
            throw new BadRequestException('Folder name too long');
        }

        const fileHash = crypto
            .createHash('md5')
            .update(file.originalname + Date.now())
            .digest('hex');

        const filename = `${fileHash}${path.extname(file.originalname)}`;
        const gcsPath = folder ? `${folder}/${filename}` : filename;

        try {
            const bucket = this.storage.bucket(this.bucketName);
            const blob = bucket.file(gcsPath);

            const blobStream = blob.createWriteStream({
                resumable: false,
                contentType: file.mimetype
            });

            await new Promise((resolve, reject) => {
                blobStream.on('error', (err) => reject(err));
                blobStream.on('finish', () => resolve(true));
                blobStream.end(file.buffer);
            });

            if (isPublic) {
                await blob.makePublic();
            }

            const fileEntity = this.fileRepository.create({
                filename,
                originalFilename: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                bucketName: this.bucketName,
                gcsPath,
                isPublic,
                path: folder,
                ownerId: userId.toString(),
                privateUrl: isPublic ? null : `https://storage.googleapis.com/${this.bucketName}/${gcsPath}`,
                publicUrl: isPublic ? `https://storage.googleapis.com/${this.bucketName}/${gcsPath}` : null
            });

            const savedFile = await this.fileRepository.save(fileEntity);

            await this.fileEventProducer.emitFileEvent(
                FileEventType.CREATED,
                savedFile,
                userId.toString(),
                { folder }
            );

            return this.mapToDto(savedFile);
        } catch (error) {
            this.logger.error( `${error.message}`, error.stack);
            throw new BadRequestException(`Failed to upload file: ${error.message}`);
        }
    }

    async getFileBuffer(payload: StorageBodyDto): Promise<{ buffer: Buffer; mimetype: string; filename: string }> {
        const file = await this.getFileById(payload);

        try {
            if (!file) {
                throw new NotFoundException(`File with id ${payload.id} not found`);
            }

           /* if (!file.isPublic && file.ownerId !== userId) {
                throw new NotFoundException(`File with id ${id} not found`);
            }
*/
            const bucket = this.storage.bucket(file.bucketName);
            const blob: GCSFile = bucket.file(file.gcsPath);
            const [buffer] = await blob.download();

            await this.fileEventProducer.emitFileEvent(
                FileEventType.DOWNLOADED,
                file, payload.userId.toString(),
            );

            return {
                buffer,
                mimetype: file.mimetype,
                filename: file.originalFilename
            };
        } catch (err: any) {
            throw new NotFoundException(`File content not found`);
        }
    }

    async downloadFile(payload: StorageBodyDto): Promise<{ signedUrl: string; filename: string; mimetype: string }> {
        const { id, userId } = payload;

        const file = await this.getFileById(payload);

        try {
            if (!file) {
                throw new NotFoundException(`File with id ${id} not found`);
            }

            const bucket = this.storage.bucket(file.bucketName);
            const blob: GCSFile = bucket.file(file.gcsPath);

            const [signedUrl] = await blob.getSignedUrl({
                action: 'read',
                expires: Date.now() + 15 * 60 * 1000, // 15 minutes
            });

            await this.fileEventProducer.emitFileEvent(
                FileEventType.DOWNLOADED,
                file,
                userId.toString()
            );

            return {
                signedUrl,
                mimetype: file.mimetype,
                filename: file.originalFilename
            };
        } catch (err: any) {
            throw new NotFoundException(`File content not found`);
        }
    }


    async getFileById(payload: StorageBodyDto): Promise<FileEntity> {

        const file = await this.fileRepository.findOne({
            where: { id: payload.id.toString() }
        });

        if (!file) {
            throw new NotFoundException(`File with id ${payload.id} not found`);
        }

        return file;
    }

    async getSignedUrl(payload: StorageBodyDto, expiresInMinutes = 15): Promise<string> {
        const file = await this.getFileById(payload);

        const bucket = this.storage.bucket(file.bucketName);
        const blob = bucket.file(file.gcsPath);

        const [signedUrl] = await blob.getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + expiresInMinutes * 60 * 1000
        });

        return signedUrl;
    }


    async deleteFile(payload: StorageBodyDto): Promise<void> {
        const { id, userId } = payload;

        const file = await this.getFileById(payload);

        try {
            const bucket = this.storage.bucket(file.bucketName);
            const blob = bucket.file(file.gcsPath);
            await blob.delete();

            await this.fileEventProducer.emitFileEvent(
                FileEventType.DELETED,
                file,
                userId.toString()
            );

            await this.fileRepository.remove(file);
        } catch (err) {
            throw new BadRequestException(`Failed to delete file: ${err.message}`);
        }
    }

    private mapToDto(file: FileEntity): FileResponseDto {
        return {
            id: file.id,
            filename: file.filename,
            originalFilename: file.originalFilename,
            mimetype: file.mimetype,
            size: file.size,
            publicUrl: file.publicUrl,
            isPublic: file.isPublic,
            ownerId: file.ownerId,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt
        };
    }
}
