import { Module } from '@nestjs/common';
import { InfraController } from './infra.controller';
import { InfraService } from './infra.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreApiSharedModule } from '@spesia/api-shared';

@Module({
    controllers: [InfraController],
    providers: [InfraService],
    imports: [
        TypeOrmModule.forFeature([]),
        CoreApiSharedModule.forRootAsync()
    ]
})
export class InfraModule {}
