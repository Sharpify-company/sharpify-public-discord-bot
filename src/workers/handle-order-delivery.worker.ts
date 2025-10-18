import { ExternalEventsEntity, OrderEntity } from "@/@shared/db/entities";
import { Sharpify } from "@/@shared/sharpify";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { HandleProductEvent } from "./usecases";
import { HandleDeliverToDiscordUserPrivate } from "./usecases/handle-deliver-to-discord-user-private";

@Injectable()
export class HandleOrderDeliveryWorker {
	constructor(private readonly handleDeliverToDiscordUserPrivate: HandleDeliverToDiscordUserPrivate) {}

	@Cron("*/3 * * * * *")
	handleCron() {
		this.execute();
	}

	async execute() {
		const pendingDeliveringOrder = await OrderEntity.findBy({ deliveryStatus: "PREPARING_DELIVERY" });

		for (const orderEntity of pendingDeliveringOrder) {
			await this.handleDeliverToDiscordUserPrivate.execute({ orderEntity });
		}
	}
}
