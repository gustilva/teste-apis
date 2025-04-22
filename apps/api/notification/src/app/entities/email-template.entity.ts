import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({schema: 'notification', name: 'email_templates'})
export class EmailTemplateEntity {
    @PrimaryColumn()
    id: string;

    @Column({ unique: true })
    name: string;

    @Column()
    subject: string;

    @Column('text')
    body: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
