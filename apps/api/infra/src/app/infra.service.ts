import { Injectable } from '@nestjs/common';

@Injectable()
export class InfraService {
    getData(): { message: string } {
        return { message: 'Hello API' };
    }
}
