import {
    Body,
    Controller,
    Get,
    HttpException,
    Inject,
    Logger,
    Post, Query,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    APP_SERVICE,
    CoreOpenApiTags,
    FileStorageTopics,
    MulterFile,
    StorageBodyDto,
    StorageUploadFileDto
} from '@spesia/common';
import { ClientProxyService, FileStorageEndpointPaths, TCP_CLIENT_PROXY } from '@spesia/api-shared';
//import { AuthGuard } from './guards/auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Readable } from 'node:stream';
import { catchError } from 'rxjs/internal/operators/catchError';
import { EMPTY, takeUntil, tap, timeout, timer } from 'rxjs';
import { randomUUID } from 'node:crypto';


@ApiTags(CoreOpenApiTags.FileStorage)
//@UseGuards(AuthGuard)
@Controller()
export class StorageController {
    constructor(
        @Inject(TCP_CLIENT_PROXY)
        private readonly proxyService: ClientProxyService) {
    }

    @Get(FileStorageEndpointPaths.SignedUrl)
    async auth(@Body() request: StorageBodyDto) {
        return this.proxyService.send(FileStorageTopics.GetSignedUrl, request, APP_SERVICE.FILE_STORAGE);
    }

    @Get(FileStorageEndpointPaths.DownloadBuffer)
    async bufferDownload(@Body() request: StorageBodyDto) {
        return this.proxyService.send(FileStorageTopics.DownloadBuffer, request, APP_SERVICE.FILE_STORAGE);
    }

    @Post(FileStorageEndpointPaths.Delete)
    async remove(@Body() request: StorageBodyDto) {
        this.proxyService.emit(FileStorageTopics.DeleteFile, request, APP_SERVICE.FILE_STORAGE);
    }


    @Get(FileStorageEndpointPaths.Buckets)
    async getBuckets() {
        return this.proxyService.send(FileStorageTopics.Buckets, undefined, APP_SERVICE.FILE_STORAGE);
    }

    @Post(FileStorageEndpointPaths.Upload)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: MulterFile,
        @Body() request: StorageUploadFileDto
    ) {

        const payload = {
            ...request,
            file: {
                originalname: file.originalname,
                mimetype: file.mimetype,
                buffer: file.buffer.toString('base64'),
                size: file.size
            }
        };

        return this.proxyService.send(
            FileStorageTopics.UploadFile,
            payload,
            APP_SERVICE.FILE_STORAGE
        );
    }

    @Get(FileStorageEndpointPaths.DownloadFile)
    async fileDownload(@Query() fileRequest: StorageBodyDto, @Res() response: Response) {
        const requestId = randomUUID();

        try {
            const observable = this.proxyService.send(
                FileStorageTopics.DownloadFile,
                fileRequest,
                APP_SERVICE.FILE_STORAGE
            );

            const timeout$ = timer(30000).pipe(
                tap(() => {
                    Logger.error(`Download request timed out [${requestId}]`);
                    if (!response.headersSent) {
                        response.status(504).json({
                            error: 'Request timed out',
                            message: 'File download service did not respond in time'
                        });
                    }
                })
            );

            observable
                .pipe(
                    timeout(30000),
                    catchError((err) => {
                        Logger.error(`Error in file download stream [${requestId}]: ${err.message}`);

                        if (!response.headersSent) {
                            const status = err instanceof HttpException ? err.getStatus() : 500;
                            const message = err instanceof HttpException ? err.message : 'Internal server error';

                            response.status(status).json({
                                error: 'Download failed',
                                message
                            });
                        }

                        return EMPTY;
                    }),
                    takeUntil(timeout$)
                )
                .subscribe({
                    next: (result: any) => {
                        if (!result) {
                            Logger.warn(`Empty result received for download [${requestId}]`);
                            return response.status(404).json({ error: 'File not found' });
                        }

                        try {
                            if (result.signedUrl) {
                                return response.redirect(result.signedUrl);
                            }

                            if (result.streamData) {
                                const streamBuffer = Buffer.from(result.streamData, 'base64');
                                const reconstructedStream = new Readable({
                                    read() {
                                        this.push(streamBuffer);
                                        this.push(null);
                                    }
                                });

                                response.setHeader('Content-Type', result.mimetype || 'application/octet-stream');
                                response.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(result.filename)}"`);
                                response.setHeader('Content-Length', streamBuffer.length);

                                reconstructedStream.pipe(response);

                                reconstructedStream.on('error', (err) => {
                                    Logger.error(`Stream error [${requestId}]: ${err.message}`);
                                    if (!response.finished) {
                                        response.end();
                                    }
                                });
                            } else {
                                Logger.warn(`No file data available [${requestId}]`);
                                response.status(404).json({ error: 'File content not available' });
                            }
                        } catch (streamError: any) {
                            if (!response.headersSent) {
                                response.status(500).json({
                                    error: 'Stream processing failed',
                                    message: streamError.message
                                });
                            }
                        }
                    },
                    error: (err: any) => {
                        if (!response.headersSent) {
                            response.status(500).json({
                                error: 'Download failed',
                                message: 'Error processing download request'
                            });
                        }
                    },
                    complete: () => {
                        Logger.debug(`File download observable completed [${requestId}]`);
                    }
                });
        } catch (error: any) {
            if (!response.headersSent) {
                response.status(500).json({
                    error: 'Internal server error',
                    message: 'Failed to process download request'
                });
            }
        }
    }

}
