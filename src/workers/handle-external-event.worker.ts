import { ExternalEventsEntity } from "@/@shared/db/entities";
import { Sharpify } from "@/@shared/sharpify";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { HandleCheckoutEvent, HandleExternalEventCreatedUsecase, HandleProductEvent } from "./usecases";

@Injectable()
export class HandleExternalEventWorker {
	constructor(private readonly handleExternalEventCreatedUsecase: HandleExternalEventCreatedUsecase) {}

	@Cron("*/5 * * * * *")
	handleCron() {
		this.execute();
	}

	async execute() {
		const pendingEvents = await ExternalEventsEntity.find();

		for (const event of pendingEvents) {
			await this.handleExternalEventCreatedUsecase.execute(event);
		}
	}
}
