import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GcpEventProducer } from './gcp-event.producer';
import { CoreApiSharedModule, FileEntity, GCSAuthGuard } from '@spesia/api-shared';
import { GcpFileStorageService } from './gcp-file-storage.service';
import { GcsController } from './gcs.controller';
import { GCP_PROVIDER_CONFIG } from '@spesia/api-shared';

@Module({
    controllers: [GcsController],
    providers: [GcpFileStorageService, GcpEventProducer, GCSAuthGuard, ...GCP_PROVIDER_CONFIG],
    imports: [
        TypeOrmModule.forFeature([FileEntity]),
        CoreApiSharedModule.forRootAsync()
    ],
    exports: [GcpFileStorageService, GcpEventProducer, GCSAuthGuard]

})
export class GcpModule {}
