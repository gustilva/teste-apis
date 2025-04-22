import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Environments } from '../../../env/src';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const err = exception.getResponse() as any;

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: err.message || exception.message || '@Internal server error',
            ...(process.env['NODE_ENV'] === Environments.DEVELOPMENT && {
                stack: exception.stack,
                error: err.error,
            }),
        };

        this.logger.error(`[${request.method}] ${request.url} - ${status} - ${errorResponse.message}`,exception.stack);

        response.status(status).json(errorResponse);
    }
}
