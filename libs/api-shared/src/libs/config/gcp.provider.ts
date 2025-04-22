import { Storage } from '@google-cloud/storage';
import { Provider } from '@nestjs/common';
import { EnvService } from '../env/src/lib/env.service';

export const GCP_STORAGE = 'GCP_STORAGE';

interface GCPCredentials {
    type: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
    universe_domain: string;
}

export const GCP_PROVIDER_CONFIG: Provider[] = [
    {
        provide: GCP_STORAGE,
        useFactory: (envService: EnvService) => {
            const cloudConfig = envService.get('CLOUD');

            const privateKey = cloudConfig.GCP_PRIVATE_KEY.replace(/\\n/g, '\n');

            const credentials: GCPCredentials = {
                type: 'service_account',
                private_key_id: cloudConfig.GCP_PRIVATE_KEY_ID,
                private_key: privateKey,
                client_email: cloudConfig.GCP_CLIENT_EMAIL,
                client_id: cloudConfig.GCP_CLIENT_ID,
                auth_uri: cloudConfig.GCP_AUTH_URI,
                token_uri: cloudConfig.GCP_TOKEN_URI,
                auth_provider_x509_cert_url: cloudConfig.GCP_AUTH_CLIENT_X509_CERT_URL,
                client_x509_cert_url: cloudConfig.GCP_AUTH_CLIENT_X509_CERT_URL,
                universe_domain: cloudConfig.GCP_UNIVERSE_DOMAIN,
            };

            return new Storage({
                projectId: cloudConfig.GCP_PROJECT_ID,
                credentials
            });
        },
        inject: [EnvService],
    },
];
