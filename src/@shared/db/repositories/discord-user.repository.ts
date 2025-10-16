import { DiscordUserEntity } from "../entities";
import { sqlite } from "../sqlite";

const tableName = "discordUsers";

class DiscordUserRepository {
	async create(discordUserEntity: DiscordUserEntity): Promise<void> {
		const insert = sqlite.prepare(`
      INSERT INTO ${tableName} (id, cartChannelId, cartMessageId, cartItems)
        VALUES (
          ?,
          ?,
          ?,
		  ?
        )     
      `);
		insert.run(
			discordUserEntity.id,
			discordUserEntity.cartChannelId,
			discordUserEntity.cartMessageId,
			JSON.stringify(discordUserEntity.cartItems),
		);
	}

	async findById(id: string): Promise<DiscordUserEntity | null> {
		const select = sqlite.prepare(`
      SELECT * FROM ${tableName} WHERE id = ?
    `);
		const row = select.get(id) as any;
		if (!row) return null;
		return DiscordUserEntity.createFromDatabase({
			id: row.id,
			cartChannelId: row.cartChannelId,
			cartMessageId: row.cartMessageId,
			cartItems: row.cartItems ? JSON.parse(row.cartItems) : [],
		});
	}

	async update(discordUserEntity: DiscordUserEntity): Promise<void> {
		const update = sqlite.prepare(`
			UPDATE ${tableName}
			SET 
				cartChannelId = ?,
				cartMessageId = ?,
				cartItems = ?
			WHERE id = ?
    	`);
		update.run(
			discordUserEntity.cartChannelId,
			discordUserEntity.cartMessageId,
			JSON.stringify(discordUserEntity.cartItems),
			discordUserEntity.id,
		);
	}
}

export async function getDiscordUserRepository(): Promise<DiscordUserRepository> {
	return new DiscordUserRepository();
}
