import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1764892192720 implements MigrationInterface {
    name = 'InitMigration1764892192720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_storeConfig" ("id" text PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "url" text NOT NULL, "image" text NOT NULL, "paymentGateways" json NOT NULL DEFAULT ('[]'), "applyRolesSettings" json NOT NULL DEFAULT ('[]'), "preferences" json NOT NULL DEFAULT ('{}'))`);
        await queryRunner.query(`INSERT INTO "temporary_storeConfig"("id", "name", "description", "url", "image", "paymentGateways", "applyRolesSettings") SELECT "id", "name", "description", "url", "image", "paymentGateways", "applyRolesSettings" FROM "storeConfig"`);
        await queryRunner.query(`DROP TABLE "storeConfig"`);
        await queryRunner.query(`ALTER TABLE "temporary_storeConfig" RENAME TO "storeConfig"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "storeConfig" RENAME TO "temporary_storeConfig"`);
        await queryRunner.query(`CREATE TABLE "storeConfig" ("id" text PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "url" text NOT NULL, "image" text NOT NULL, "paymentGateways" json NOT NULL DEFAULT ('[]'), "applyRolesSettings" json NOT NULL DEFAULT ('[]'))`);
        await queryRunner.query(`INSERT INTO "storeConfig"("id", "name", "description", "url", "image", "paymentGateways", "applyRolesSettings") SELECT "id", "name", "description", "url", "image", "paymentGateways", "applyRolesSettings" FROM "temporary_storeConfig"`);
        await queryRunner.query(`DROP TABLE "temporary_storeConfig"`);
    }

}
