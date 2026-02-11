import path from "path";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
	type: "better-sqlite3",
	database: path.join(process.cwd(), "/database.db"),
	// synchronize: true,
	entities: [process.cwd() + "/dist/**/*.entity.{ts,js}", process.cwd() + "/out/**/*.entity.{ts,js}"],
	migrations: [process.cwd() + "/dist/migrations/*.{ts,js}", process.cwd() + "/out/migrations/*.{ts,js}"],
	migrationsTableName: "typeorm_migrations",
});

export class TypeormProvider {
	static async init() {
		await AppDataSource.initialize();
		await AppDataSource.runMigrations();
		console.log("Database connected and migrations run.");
	}
}
