import { ExternalEventsEntity, ProductEntity } from "@/@shared/db/entities";
import { ProductProps } from "@/@shared/sharpify/api";
import { ProductCardComponent } from "@/bot/checkout/components";
import { Inject, Injectable } from "@nestjs/common";
import { Client, TextChannel } from "discord.js";
import {} from "necord";
import { HandleProductEvent } from "./handle-product-event";
import { HandleCheckoutEvent } from "./handle-checkout-event";
import { HandleFeedbackEvent } from "./handle-feedback-event";

@Injectable()
export class HandleExternalEventCreatedUsecase {
	constructor(
		@Inject(Client) private readonly client: Client,
		private readonly handleProductEvent: HandleProductEvent,
		private readonly handleCheckoutEvent: HandleCheckoutEvent,
		private readonly handleFeedbackEvent: HandleFeedbackEvent,
	) {}

	async execute(event: ExternalEventsEntity) {
		if (event.eventName === "PRODUCT_DELETED" || event.eventName === "PRODUCT_UPDATED") {
			await this.handleProductEvent.create(event);
		}
		if (event.eventName === "ORDER_APPROVED" || event.eventName === "ORDER_CANCELLED") {
			await this.handleCheckoutEvent.create(event);
		}

		if (event.eventName === "ORDER_FEEDBACK_RECEIVED") {
			await this.handleFeedbackEvent.create(event);
		}

		await event.remove();
	}
}
