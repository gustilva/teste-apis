import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMailTemplatesToAuth1743170350915 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const templates = [
            {
                id: 'welcome-email',
                name: 'welcome-email',
                subject: 'Welcome to Spesia {{ name }}',
                body: ''
            },
            {
                id: 'reset-password',
                name: 'reset-password',
                subject: 'Reset Your Password for {{ email }}',
                body: ''
            },
            {
                id: 'password-changed',
                name: 'password Changed',
                subject: 'Password Changed Successfully',
                body: ''
            },
            {
                id: 'deactivate-account',
                name: 'deactivate-account',
                subject: 'Account Deactivation Confirmation',
                body: ''
            },
            {
                id: 'confirm-email',
                name: 'confirm-email',
                subject: 'Confirm Your Account {{ name }}',
                body: ''
            },
            {
                id: 'confirm-email-notification',
                name: 'confirm-email-notification',
                subject: 'Confirm Your Email change to {{ email }}',
                body: ''
            },
            {
                id: 'change-email',
                name: 'change-email',
                subject: 'Request change email to {{ email }}',
                body: ''
            }
        ];

        const query = `
            INSERT INTO notification.email_templates ("id", "name", "subject", "body")
            VALUES ${templates.map((_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`).join(', ')}
            ON CONFLICT ("id") DO UPDATE
            SET "name" = EXCLUDED."name",
                "subject" = EXCLUDED."subject",
                "body" = EXCLUDED."body"
        `;

        const flattenedValues = templates.flatMap(template => [
            template.id,
            template.name,
            template.subject,
            template.body
        ]);

        await queryRunner.query(query, flattenedValues);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const query = `
            DELETE FROM notification.email_templates
            WHERE "id" IN (
                'welcome-email',
                'reset-password',
                'password-changed',
                'deactivate-account',
                'confirm-email',
                'confirm-email-notification',
                'change-email'
            )
        `;

        await queryRunner.query(query);
    }
}
