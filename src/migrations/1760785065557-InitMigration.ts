import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1760785065557 implements MigrationInterface {
    name = 'InitMigration1760785065557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "storeConfig" ("id" text PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "url" text NOT NULL, "image" text NOT NULL, "paymentGateways" json NOT NULL DEFAULT ('[]'))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" text PRIMARY KEY NOT NULL, "orderProps" json NOT NULL, "channelsLinked" json NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" text PRIMARY KEY NOT NULL, "orderProps" json NOT NULL, "customerId" text NOT NULL, "deliveryStatus" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "externalEvents" ("id" text PRIMARY KEY NOT NULL, "eventName" text NOT NULL, "contextAggregateId" text NOT NULL, "payload" json NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "discordUsers" ("id" text PRIMARY KEY NOT NULL, "cart_channelId" text, "cart_messageId" text, "cart_items" json NOT NULL DEFAULT ('[]'), "cart_ gatewayMethod" text, "cart_couponCode" text, "cart_subTotalPrice" real NOT NULL DEFAULT (0), "cart_totalPrice" real NOT NULL DEFAULT (0), "cart_createdAt" text, "cart_isOpened" boolean NOT NULL DEFAULT (0), "personalInfo_firstName" text, "personalInfo_lastName" text, "personalInfo_email" text)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "discordUsers"`);
        await queryRunner.query(`DROP TABLE "externalEvents"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "storeConfig"`);
    }

}
