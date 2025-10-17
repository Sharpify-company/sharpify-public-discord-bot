import { DiscordUserEntity } from "../entities";
import { sqlite } from "../sqlite";

// CREATE TABLE "discordUsers" (
// 	"id"	TEXT,
// 	"cartChannelId"	TEXT,
// 	"cartMessageId"	TEXT,
// 	"cartItems"	TEXT,
// 	"couponCode"	TEXT,
// 	"subTotalPrice"	REAL,
// 	"totalPrice"	REAL,
// 	"firstName"	TEXT,
// 	"lastName"	TEXT,
// 	"email"	TEXT,
// 	PRIMARY KEY("id")
// );

const tableName = "discordUsers";

class DiscordUserRepository {
	async create(discordUserEntity: DiscordUserEntity): Promise<void> {
		const insert = sqlite.prepare(`
      INSERT INTO ${tableName} (id, cartChannelId, cartMessageId, cartItems, couponCode, subTotalPrice, totalPrice, firstName, lastName, email)
        VALUES (
          ?,
          ?,
          ?,
		  ?,
		  ?,
		  ?,
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
			discordUserEntity.couponCode,
			discordUserEntity.subTotalPrice,
			discordUserEntity.totalPrice,
			discordUserEntity.firstName,
			discordUserEntity.lastName,
			discordUserEntity.email
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
			couponCode: row.couponCode,
			subTotalPrice: row.subTotalPrice,
			totalPrice: row.totalPrice,
			firstName: row.firstName,
			lastName: row.lastName,
			email: row.email,
		});
	}

	async update(discordUserEntity: DiscordUserEntity): Promise<void> {
		const update = sqlite.prepare(`
			UPDATE ${tableName}
			SET 
				cartChannelId = ?,
				cartMessageId = ?,
				cartItems = ?,
				couponCode = ?,
				subTotalPrice = ?,
				totalPrice = ?,
				firstName = ?,
				lastName = ?,
				email = ?
			WHERE id = ?
    	`);
		update.run(
			discordUserEntity.cartChannelId,
			discordUserEntity.cartMessageId,
			JSON.stringify(discordUserEntity.cartItems),
			discordUserEntity.couponCode,
			discordUserEntity.subTotalPrice,
			discordUserEntity.totalPrice,
			discordUserEntity.firstName,
			discordUserEntity.lastName,
			discordUserEntity.email,
			discordUserEntity.id,
		);
	}
}

export async function getDiscordUserRepository(): Promise<DiscordUserRepository> {
	return new DiscordUserRepository();
}
