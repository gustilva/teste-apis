import { EnvService } from '../env/src/lib/env.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import * as fs from 'fs';
import * as handlebars from 'handlebars';

export const MAILER_MODULE_CONFIG: () => MailerAsyncOptions = () => ({
    imports: [],
    inject: [EnvService],
    useFactory: (service: EnvService) => {
        const templatesDir = join(process.cwd(), 'dist/apps/api/notification/app/templates');

        const partialPath = join(templatesDir, 'base-layout-web-html.partial.hbs');
        if (fs.existsSync(partialPath)) {
            const partialTemplate = fs.readFileSync(partialPath, 'utf8');
            handlebars.registerPartial('webLayoutHtmlEn', partialTemplate);
        }

        const secure: boolean = service.get('MAIL').MAIL_SECURE;
        const transport = service.get('MAIL').MAIL_TRANSPORT;

        return {
            transport: {
                host: service.get('MAIL').MAIL_HOST,
                port: service.get('MAIL').MAIL_PORT,
                secure: transport === 'smtp' ? false : secure,
                ignoreTLS: !secure,
                auth: {
                    user: service.get('MAIL').MAIL_USER,
                    pass: service.get('MAIL').MAIL_PASSWORD
                }
            },
            defaults: {
                from: `"${service.get('MAIL').MAIL_FROM_NAME}" <${service.get('MAIL').MAIL_FROM_ADDRESS}>`
            },
            template: {
                dir: templatesDir,
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true
                }
            }
        };
    }
});
