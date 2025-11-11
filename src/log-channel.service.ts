import { ExternalEventsEntity } from "@/@shared/db/entities";
import { Sharpify } from "@/@shared/sharpify";
import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Client, MessageCreateOptions, MessagePayload, TextChannel } from "discord.js";
import { dotEnv } from "./@shared/lib";

@Injectable()
export class LogChannel {
	constructor(@Inject(Client) private readonly client: Client) {}
	async sendMessage(options: string | MessagePayload | MessageCreateOptions) {
		if (!dotEnv.LOG_CHANNEL_ID) return;
		const channel = (await this.client?.channels.fetch(dotEnv.LOG_CHANNEL_ID).catch(() => null)) as TextChannel;
		if (!channel || !channel.isTextBased()) return;
		await channel.send(options).catch((err) => {
			console.error("❌ Failed to send log message:", err);
		});
	}
}