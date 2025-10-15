import { DiscordUserEntity } from '../entities';
import { sqlite } from "../sqlite"

const tableName = 'discordUsers';

class DiscordUserRepository {
  async create(discordUserEntity: DiscordUserEntity): Promise<void> {
    const insert = sqlite.prepare(`
      INSERT INTO ${tableName} (id, cartChannelId, cartMessageId)
        VALUES (
          ?,
          ?,
          ?
        )     
      `)
    insert.run(
      discordUserEntity.id,
      discordUserEntity.cartChannelId,
      discordUserEntity.cartMessageId
    )

  }

  async findById(id: string): Promise<DiscordUserEntity | null> {
    const select = sqlite.prepare(`
      SELECT * FROM ${tableName} WHERE id = ?
    `)
    const row = select.get(id) as any
    if (!row) return null
    return new DiscordUserEntity({
      id: row.id,
      cartChannelId: row.cartChannelId,
      cartMessageId: row.cartMessageId
    })
  }

  update(discordUserEntity: DiscordUserEntity): Promise<void> {
    const update = sqlite.prepare(`
      UPDATE ${tableName}
      SET 
          cartChannelId = ?,
          cartMessageId = ?
      WHERE id = ?
    `)
    update.run(
      discordUserEntity.cartChannelId,
      discordUserEntity.cartMessageId,
      discordUserEntity.id
    )
    return Promise.resolve()
  }
}

export async function getDiscordUserRepository(): Promise<DiscordUserRepository> {
  return new DiscordUserRepository();
}
