import { ExternalEventsEntity } from "@/@shared/db/entities";
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
		const req = await Sharpify.api.v1.commomServices.externalEvents.listPendingEvents();
		if (!req.success) return console.log("Error fetching events:", req.errorName);

		for (const event of req.data.events) {
			const exists = await ExternalEventsEntity.findOneBy({ id: event.id });
			if (exists) continue;

			if (!event.id || !event.contextAggregateId || !event.eventName) return;

			try {
				await ExternalEventsEntity.createExternalEvent({
					id: event.id,
					contextAggregateId: event.contextAggregateId,
					eventName: event.eventName,
					payload: event.payload,
				}).save();
			} catch (err) {
				const error = err as any;
				// Verifica se o erro é de constraint única (SQLite usa o código 'SQLITE_CONSTRAINT')
				if (error.code === "SQLITE_CONSTRAINT" || error.message.includes("UNIQUE")) {
					console.log(`Evento ${event.id} já existe, ignorando...`);
				} else {
					// Se for outro erro, dispara novamente
					throw error;
				}
			}
		}
		await Sharpify.api.v1.commomServices.externalEvents.markAsReceived({ ids: req.data.events.map((e) => e.id) });
	}
}
