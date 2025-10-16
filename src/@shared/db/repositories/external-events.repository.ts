import { ExternalEventsEntity } from "../entities";
import { sqlite } from "../sqlite";

const tableName = "externalEvents";

// CREATE TABLE "externalEvents" (
// 	"id"	TEXT,
// 	"eventName"	TEXT,
// 	"contextAggregateId"	TEXT,
// 	"payload"	TEXT,
// 	PRIMARY KEY("id")
// );

class ExternalEventsRepository {
	async create(externalEvent: ExternalEventsEntity): Promise<void> {
		const insert = sqlite.prepare(`
        INSERT INTO ${tableName} (id, eventName, contextAggregateId, payload)
            VALUES (
            ?,
            ?,
            ?,
            ?
        )     
      `);
		insert.run(
			externalEvent.id,
			externalEvent.eventName,
			externalEvent.contextAggregateId,
			JSON.stringify(externalEvent.payload),
		);
	}

	async findById(id: string): Promise<ExternalEventsEntity | null> {
		const select = sqlite.prepare(`
      SELECT * FROM ${tableName} WHERE id = ?
    `);
		const row = select.get(id) as any;
		if (!row) return null;
		return new ExternalEventsEntity({
			id: row.id,
			eventName: row.eventName,
			contextAggregateId: row.contextAggregateId,
			payload: JSON.parse(row.payload),
		});
	}

	async listAll(): Promise<ExternalEventsEntity[]> {
		const select = sqlite.prepare(`
	  		SELECT * FROM ${tableName}
		`);
		const rows = select.all() as any[];
		return rows.map(
			(row) =>
				new ExternalEventsEntity({
					id: row.id,
					eventName: row.eventName,
					contextAggregateId: row.contextAggregateId,
					payload: JSON.parse(row.payload),
				}),
		);
	}

	async update(externalEventsEntity: ExternalEventsEntity): Promise<void> {
		const update = sqlite.prepare(`
        UPDATE ${tableName}
        SET 
            eventName = ?,
            contextAggregateId = ?,
            payload = ?
        WHERE id = ?
    `);
		update.run(
			externalEventsEntity.eventName,
			externalEventsEntity.contextAggregateId,
			JSON.stringify(externalEventsEntity.payload),
			externalEventsEntity.id,
		);
		return Promise.resolve();
	}

	async delete(id: string): Promise<void> {
		const del = sqlite.prepare(`
		DELETE FROM ${tableName} WHERE id = ?
	`);
		del.run(id);
	}
}

export async function getExternalEventsRepository(): Promise<ExternalEventsRepository> {
	return new ExternalEventsRepository();
}
