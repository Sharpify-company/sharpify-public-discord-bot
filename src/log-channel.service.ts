import { ExternalEventsEntity } from "@/@shared/db/entities";
import { getLocalStoreConfig, Sharpify } from "@/@shared/sharpify";
import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Client, MessageCreateOptions, MessagePayload, TextChannel } from "discord.js";
import { dotEnv } from "./@shared/lib";

@Injectable()
export class LogChannel {
	constructor(@Inject(Client) private readonly client: Client) {}
	async sendMessage(options: string | MessagePayload | MessageCreateOptions) {
		const storeEntity = await getLocalStoreConfig();
		const storePreferences = storeEntity.getPreferences();
		if (!storePreferences.failLog.enabled) return;

		const guild = await this.client.guilds.fetch(process.env.DISCORD_GUILD_ID!).catch(() => null);
		if (!guild) return;

		const channel = (await this.client?.channels.fetch(storePreferences.failLog.channelId!).catch(() => null)) as TextChannel;
		if (!channel || !channel.isTextBased()) return;
		await channel.send(options).catch((err) => {
			console.error("❌ Failed to send log message:", err);
		});
	}
}
