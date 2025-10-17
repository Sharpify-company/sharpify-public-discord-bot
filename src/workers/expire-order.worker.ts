import { ExternalEventsEntity } from "@/@shared/db/entities";
import { getDiscordUserRepository, getExternalEventsRepository, getOrderRepository } from "@/@shared/db/repositories";
import { Sharpify } from "@/@shared/sharpify";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { HandleProductEvent } from "./usecases";
import { Client } from "discord.js";

@Injectable()
export class ExpireOrderWorker {
	constructor(@Inject(Client) private readonly client: Client) {}

	@Cron("*/15 * * * * *")
	handleCron() {
		this.execute();
	}

	async execute() {
		const discordUserRepository = await getDiscordUserRepository();

		const users = await discordUserRepository.listToExpireOrdersFromUser();

		for (const userEntity of users) {
            
            const channel = await this.client.channels.fetch(userEntity.cartChannelId!).catch(() => null);
            await channel?.delete().catch(() => null);
            
            userEntity.cancelOrder()
            await discordUserRepository.update(userEntity);
		}
	}
}
