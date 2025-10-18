import { ApplicationEmoji, Client } from "discord.js";
import { EmojiEntity } from "../db/entities";

export async function FindEmojiHelper({
	client,
	name,
}: {
	name: EmojiEntity.EmojiNameEnum;
	client: Client;
}): Promise<ApplicationEmoji | null | undefined> {
	const ticketEmojiEntity = await EmojiEntity.findOneBy({ name });

	const cacheEmoji = client.application?.emojis.cache.get(ticketEmojiEntity?.id!);
	if (cacheEmoji) return cacheEmoji;

	return await client.application?.emojis.fetch(ticketEmojiEntity?.id!).catch(() => null);
}
