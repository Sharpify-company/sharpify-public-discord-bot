"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InitMigration1764288263319", {
    enumerable: true,
    get: function() {
        return InitMigration1764288263319;
    }
});
let InitMigration1764288263319 = class InitMigration1764288263319 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "temporary_storeConfig" ("id" text PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "url" text NOT NULL, "image" text NOT NULL, "paymentGateways" json NOT NULL DEFAULT ('[]'), "applyRolesSettings" json NOT NULL DEFAULT ('[]'))`);
        await queryRunner.query(`INSERT INTO "temporary_storeConfig"("id", "name", "description", "url", "image", "paymentGateways") SELECT "id", "name", "description", "url", "image", "paymentGateways" FROM "storeConfig"`);
        await queryRunner.query(`DROP TABLE "storeConfig"`);
        await queryRunner.query(`ALTER TABLE "temporary_storeConfig" RENAME TO "storeConfig"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "storeConfig" RENAME TO "temporary_storeConfig"`);
        await queryRunner.query(`CREATE TABLE "storeConfig" ("id" text PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "url" text NOT NULL, "image" text NOT NULL, "paymentGateways" json NOT NULL DEFAULT ('[]'))`);
        await queryRunner.query(`INSERT INTO "storeConfig"("id", "name", "description", "url", "image", "paymentGateways") SELECT "id", "name", "description", "url", "image", "paymentGateways" FROM "temporary_storeConfig"`);
        await queryRunner.query(`DROP TABLE "temporary_storeConfig"`);
    }
    constructor(){
        this.name = 'InitMigration1764288263319';
    }
};

//# sourceMappingURL=1764288263319-InitMigration.js.map