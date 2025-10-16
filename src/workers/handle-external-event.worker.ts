import { ExternalEventsEntity } from "@/@shared/db/entities";
import { getExternalEventsRepository } from "@/@shared/db/repositories";
import { Sharpify } from "@/@shared/sharpify";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { HandleProductEvent } from "./usecases";

@Injectable()
export class HandleExternalEventWorker {
	constructor(private readonly handleProductEvent: HandleProductEvent) {}

	@Cron("*/5 * * * * *")
	handleCron() {
		this.execute();
	}

	async execute() {
		const externalEventsRepository = await getExternalEventsRepository();

		const pendingEvents = await externalEventsRepository.listAll();

		for (const event of pendingEvents) {
			if (event.eventName === "PRODUCT_DELETED" || event.eventName === "PRODUCT_UPDATED") {
				await this.handleProductEvent.create(event);
				await externalEventsRepository.delete(event.id);
			}
		}
	}
}
