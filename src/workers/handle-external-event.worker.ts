import { ExternalEventsEntity } from "@/@shared/db/entities";
import { Sharpify } from "@/@shared/sharpify";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { HandleCheckoutEvent, HandleProductEvent } from "./usecases";

@Injectable()
export class HandleExternalEventWorker {
	constructor(
		private readonly handleProductEvent: HandleProductEvent,
		private readonly handleCheckoutEvent: HandleCheckoutEvent,
	) {}

	@Cron("*/5 * * * * *")
	handleCron() {
		this.execute();
	}

	async execute() {
		const pendingEvents = await ExternalEventsEntity.find();

		for (const event of pendingEvents) {
			if (event.eventName === "PRODUCT_DELETED" || event.eventName === "PRODUCT_UPDATED") {
				await this.handleProductEvent.create(event);
			}
			if (event.eventName === "ORDER_APPROVED") {
				await this.handleCheckoutEvent.create(event);
			}
			await event.remove();
		}
	}
}
