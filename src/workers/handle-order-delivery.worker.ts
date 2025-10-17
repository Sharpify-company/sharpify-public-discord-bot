import { ExternalEventsEntity } from "@/@shared/db/entities";
import { getExternalEventsRepository, getOrderRepository } from "@/@shared/db/repositories";
import { Sharpify } from "@/@shared/sharpify";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { HandleProductEvent } from "./usecases";
import { HandleDeliverToDiscordUserPrivate } from "./usecases/handle-deliver-to-discord-user-private";

@Injectable()
export class HandleOrderDeliveryWorker {
	constructor(private readonly handleDeliverToDiscordUserPrivate: HandleDeliverToDiscordUserPrivate) {}

	@Cron("*/5 * * * * *")
	handleCron() {
		this.execute();
	}

	async execute() {
		const orderRepository = await getOrderRepository();

		const pendingDeliveringOrder = await orderRepository.listAllPendingDelivery();

		for (const orderEntity of pendingDeliveringOrder) {
			await this.handleDeliverToDiscordUserPrivate.execute({ orderEntity });
		}
	}
}
