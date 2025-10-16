import { ExternalEventsEntity } from "@/@shared/db/entities";
import { getExternalEventsRepository } from "@/@shared/db/repositories";
import { Sharpify } from "@/@shared/sharpify";
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class ConsumeExternalEventWorker {
	@Cron("*/15 * * * * *")
	handleCron() {
		this.execute();
	}

	async execute() {
		const externalEventsRepository = await getExternalEventsRepository();
		const req = await Sharpify.api.v1.commomServices.externalEvents.listPendingEvents();
		if (!req.success) return console.log("Error fetching events:", req.errorName);

		for (const event of req.data.events) {
			const exists = await externalEventsRepository.findById(event.id);
			if (exists) continue;
			const externalEventEntity = ExternalEventsEntity.create({
				id: event.id,
				contextAggregateId: event.contextAggregateId,
				eventName: event.eventName,
				payload: event.payload,
			});
			await externalEventsRepository.create(externalEventEntity);
		}
		await Sharpify.api.v1.commomServices.externalEvents.markAsReceived({ ids: req.data.events.map((e) => e.id) });
	}
}
