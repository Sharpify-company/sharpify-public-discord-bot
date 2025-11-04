"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InitMigration1760825076228", {
    enumerable: true,
    get: function() {
        return InitMigration1760825076228;
    }
});
let InitMigration1760825076228 = class InitMigration1760825076228 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "storeConfig" ("id" text PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "url" text NOT NULL, "image" text NOT NULL, "paymentGateways" json NOT NULL DEFAULT ('[]'))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" text PRIMARY KEY NOT NULL, "orderProps" json NOT NULL, "channelsLinked" json NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" text PRIMARY KEY NOT NULL, "orderProps" json NOT NULL, "customerId" text NOT NULL, "deliveryStatus" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "Emojis" ("id" text PRIMARY KEY NOT NULL, "name" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "externalEvents" ("id" text PRIMARY KEY NOT NULL, "eventName" text NOT NULL, "contextAggregateId" text NOT NULL, "payload" json NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "discordUsers" ("id" text PRIMARY KEY NOT NULL, "cart_channelId" text, "cart_messageId" text, "cart_items" json NOT NULL DEFAULT ('[]'), "cart_ gatewayMethod" text, "cart_couponCode" text, "cart_subTotalPrice" real NOT NULL DEFAULT (0), "cart_totalPrice" real NOT NULL DEFAULT (0), "cart_createdAt" datetime, "cart_isOpened" boolean NOT NULL DEFAULT (0), "personalInfo_firstName" text, "personalInfo_lastName" text, "personalInfo_email" text)`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "discordUsers"`);
        await queryRunner.query(`DROP TABLE "externalEvents"`);
        await queryRunner.query(`DROP TABLE "Emojis"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "storeConfig"`);
    }
    constructor(){
        this.name = 'InitMigration1760825076228';
    }
};

//# sourceMappingURL=1760825076228-InitMigration.js.map