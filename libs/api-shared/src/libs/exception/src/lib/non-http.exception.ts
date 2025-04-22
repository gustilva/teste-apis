import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { Environments } from '../../../env/src';

@Catch(Error)
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message || '!Internal server error',
            ...(process.env['NODE_ENV'] === Environments.DEVELOPMENT && {
                stack: exception.stack,
                error: exception.message,
            }),
        };

        this.logger.error(`[${request.method}] ${request.url} - ${status} - ${errorResponse.message}`,exception.stack);

        response.status(status).json(errorResponse);
    }
}
