import {
    ExceptionFilter,
    Catch,
    ArgumentsHost, HttpStatus
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
        const error = exception.getError() as any;

        const formattedError = {
            statusCode: error.status || HttpStatus.CONFLICT,
            message: error?.message,
            errorCode: error.errorCode || null
        };

        return throwError(() => formattedError);
    }
}
