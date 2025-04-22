import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';

@Entity({ name: 'files', schema: 'storage' })
export class FileEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    filename: string;

    @Column()
    originalFilename: string;

    @Column()
    mimetype: string;

    @Column()
    size: number;

    @Column()
    path: string;

    @Column()
    bucketName: string;

    @Column()
    gcsPath: string;

    @Column({ nullable: true })
    publicUrl: string;

    @Column({ nullable: true })
    privateUrl: string;

    @Column({ default: false })
    isPublic: boolean;

    @ManyToOne(() => UserEntity, { nullable: true })
    owner: UserEntity;

    @Column({ nullable: true })
    ownerId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
