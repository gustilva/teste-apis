import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoreOpenApiTags } from '@spesia/common';
import { KafkaEndpointPaths, KafkaMonitorService } from '@spesia/api-shared';
import { AuthGuard } from './guards/auth.guard';

@ApiTags(CoreOpenApiTags.KafkaMonitor)
//@UseGuards(AuthGuard)
@Controller()
export class KafkaMonitorController  {
    constructor(private readonly kafkaMonitor: KafkaMonitorService) {}


    @Get(KafkaEndpointPaths.Messages)
    getMessages() {
        return this.kafkaMonitor.getMessages();
    }

    @Post(KafkaEndpointPaths.EditMessage)
    editMessage(@Body() body: { topic: string; key: string; value: string }) {
        return this.kafkaMonitor.editMessage(body.topic, body.key, body.value);
    }

    @Post(KafkaEndpointPaths.RemoveMessage)
    removeMessage(@Body() body: { topic: string; key: string }) {
        return this.kafkaMonitor.removeMessage(body.topic, body.key);
    }

}
