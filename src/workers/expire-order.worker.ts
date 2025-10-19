import { DiscordUserEntity, ExternalEventsEntity } from "@/@shared/db/entities";
import { Sharpify } from "@/@shared/sharpify";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { HandleProductEvent } from "./usecases";
import { Client } from "discord.js";
import { LessThan } from "typeorm";
import { subMinutes } from "date-fns";

@Injectable()
export class ExpireOrderWorker {
	constructor(@Inject(Client) private readonly client: Client) {}

	@Cron("*/15 * * * * *")
	handleCron() {
		this.execute();
	}

	async execute() {
		const users = await DiscordUserEntity.findBy({
			cart: {
				cartCreatedAt: LessThan(subMinutes(new Date(), 15)),
			},
		});

		for (const userEntity of users) {
			const channel = await this.client.channels.fetch(userEntity.cart.channelId).catch(() => null);
			await channel?.delete().catch(() => null);

			await userEntity.cart.cancelOrder();
		}
	}
}
