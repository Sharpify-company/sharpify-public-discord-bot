"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get AppDataSource () {
        return AppDataSource;
    },
    get TypeormProvider () {
        return TypeormProvider;
    }
});
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _typeorm = require("typeorm");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const AppDataSource = new _typeorm.DataSource({
    type: "better-sqlite3",
    database: _path.default.join(process.cwd(), "/database.db"),
    // synchronize: true,
    entities: [
        process.cwd() + "/dist/**/*.entity.{ts,js}",
        process.cwd() + "/out/**/*.entity.{ts,js}"
    ],
    migrations: [
        process.cwd() + "/dist/migrations/*.{ts,js}",
        process.cwd() + "/out/migrations/*.{ts,js}"
    ],
    migrationsTableName: "typeorm_migrations"
});
let TypeormProvider = class TypeormProvider {
    static async init() {
        await AppDataSource.initialize();
        await AppDataSource.runMigrations();
        console.log("Database connected and migrations run.");
    }
};

//# sourceMappingURL=index.js.map