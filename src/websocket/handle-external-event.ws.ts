import { ExternalEventsEntity, OrderEntity } from "@/@shared/db/entities";
import { Sharpify } from "@/@shared/sharpify";
import { ExternalEventsProps } from "@/@shared/sharpify/api";
import { WsProps } from "@/@shared/types";
import { WsClientService } from "@/app.ws.service";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class HandleExternalEventWs implements OnModuleInit {
	constructor(
		private readonly wsClientService: WsClientService,
	) {}

	onModuleInit() {
		this.wsClientService
			.on<
				WsProps<{ externalEvent: ExternalEventsProps }>
			>("commom_services:external_integration_events:external_event_created")
			.subscribe(async ({ payload: { externalEvent: event } }) => {
				const exists = await ExternalEventsEntity.findOneBy({ id: event.id });
				if (exists) return;

				if(!event.id || !event.contextAggregateId || !event.eventName) return;

				await ExternalEventsEntity.createExternalEvent({
					id: event.id,
					contextAggregateId: event.contextAggregateId,
					eventName: event.eventName,
					payload: event.payload,
				}).save();
			});
	}
}
