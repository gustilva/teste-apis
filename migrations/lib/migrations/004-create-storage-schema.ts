import { MigrationInterface, QueryRunner } from 'typeorm';

export class createStorageSchema1744024431445 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.query(`CREATE SCHEMA storage AUTHORIZATION spesia;`);
        } catch (e) {
            console.log(e);
        }
    }

    public async down(queryRunner: QueryRunner) {
        return null;
    }

}
