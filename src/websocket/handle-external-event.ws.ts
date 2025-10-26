import { ExternalEventsEntity, OrderEntity } from "@/@shared/db/entities";
import { Sharpify } from "@/@shared/sharpify";
import { ExternalEventsProps } from "@/@shared/sharpify/api";
import { WsProps } from "@/@shared/types";
import { WsClientService } from "@/app.ws.service";
import { HandleExternalEventCreatedUsecase } from "@/workers/usecases";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class HandleExternalEventWs implements OnModuleInit {
	constructor(
		private readonly wsClientService: WsClientService,
		private readonly handleExternalEventCreatedUsecase: HandleExternalEventCreatedUsecase,
	) {}

	onModuleInit() {
		this.wsClientService
			.on<
				WsProps<{ externalEvent: ExternalEventsProps }>
			>("commom_services:external_integration_events:external_event_created")
			.subscribe(async ({ payload: { externalEvent: event } }) => {
				const exists = await ExternalEventsEntity.findOneBy({ id: event.id });
				if (exists) return;
				await ExternalEventsEntity.createExternalEvent({
					id: event.id,
					contextAggregateId: event.contextAggregateId,
					eventName: event.eventName,
					payload: event.payload,
				}).save();
			});
	}
}
