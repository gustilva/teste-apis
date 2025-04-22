import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { GCP_STORAGE } from '../config/gcp.provider';

@Injectable()
export class GCSAuthGuard implements CanActivate {
    constructor(
        @Inject(GCP_STORAGE) private readonly storage: Storage
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        try {
            // Verify if the bucket exists or check permissions
            // const [exists] = await this.storage.bucket('your-bucket').exists();
            // if (!exists) {
            //     throw new UnauthorizedException('Bucket not found');
            // }

            return true; // Allow the request
        } catch (error) {
            throw new UnauthorizedException('GCS authentication failed');
        }
    }
}
