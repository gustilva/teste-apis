import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { EmailStatus } from '@spesia/common';

@Entity({ schema: 'notification', name: 'mail_notifications' })
export class EmailNotificationEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    templateId: string;

    @Column('jsonb')
    recipient: {
        email: string;
        name?: string;
    };

    @Column('jsonb')
    variables?: Record<string, any>;

    @Column({ nullable: true, type: 'timestamp' })
    sentAt: Date | null;

    @Column({
        type: 'enum',
        enum: EmailStatus,
        default: EmailStatus.PENDING
    })
    status: EmailStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
