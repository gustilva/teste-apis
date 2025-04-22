import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotificationSchemaMigration1710465600010 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        try{
            await queryRunner.query(`CREATE SCHEMA notification AUTHORIZATION spesia;`);
        }catch (e){
            console.log(e);
        }
    }

    public async down(queryRunner: QueryRunner) {
        return null;
    }
}
