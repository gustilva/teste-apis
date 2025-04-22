import { Controller, Get } from '@nestjs/common';
import { InfraService } from './infra.service';

@Controller()
export class InfraController {
    constructor(private readonly appService: InfraService) {}

    @Get()
    getData() {
        return this.appService.getData();
    }
}
