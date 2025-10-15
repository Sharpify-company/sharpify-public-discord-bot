import { DiscordUserEntity } from '../entities';

const prefix = 'discordUser_';

const memoryDb: Record<string, DiscordUserEntity> = {};

class DiscordUserRepository {
  async create(discordUserEntity: DiscordUserEntity): Promise<void> {
    memoryDb[`${prefix}${discordUserEntity.id}`] = discordUserEntity;
  }

  async findById(id: string): Promise<DiscordUserEntity | null> {
    return memoryDb[`${prefix}${id}`] || null;
  }

  update(discordUserEntity: DiscordUserEntity): Promise<void> {
    memoryDb[`${prefix}${discordUserEntity.id}`] = discordUserEntity;
    return Promise.resolve();
  }
}

export async function getDiscordUserRepository(): Promise<DiscordUserRepository> {
  return new DiscordUserRepository();
}
