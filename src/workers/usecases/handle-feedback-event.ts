import { ExternalEventsEntity, OrderEntity } from "@/@shared/db/entities";
import { getLocalStoreConfig } from "@/@shared/sharpify";
import { OrderProps, ProductProps } from "@/@shared/sharpify/api";
import { ProductCardComponent } from "@/bot/checkout/components";
import { HandleOrderApprovedUsecase, HandleOrderCancelledUsecase } from "@/bot/checkout/components/checkout-card/usecases";
import { HandleOrderFeedbackSentUsecase } from "@/bot/checkout/components/checkout-card/usecases/handle-order-feedback-sent/_handle-order-feedback-sent.usecase";
import { Inject, Injectable } from "@nestjs/common";
import { Client, TextChannel } from "discord.js";
import {} from "necord";

@Injectable()
export class HandleFeedbackEvent {
	constructor(
		@Inject(Client) private readonly client: Client,
		private readonly handleOrderFeedbackSentUsecase: HandleOrderFeedbackSentUsecase,
	) {}

	async create(externalEventEntity: ExternalEventsEntity) {
		const payloadOrder: OrderProps = externalEventEntity.payload as OrderProps;
		const orderEntity = await OrderEntity.findOneBy({ id: externalEventEntity.contextAggregateId });
		if (!orderEntity) {
			await this.handleOrderFeedbackSentUsecase.sendPrivateLog({
				order: payloadOrder,
				discordUserId: payloadOrder.customer?.info?.platform.discordId,
			});

			await this.handleOrderFeedbackSentUsecase.sendPublicLog({
				order: payloadOrder,
				discordUserId: payloadOrder.customer?.info?.platform.discordId,
			});

			return;
		}

		if (externalEventEntity.eventName === "ORDER_FEEDBACK_RECEIVED") {
			await orderEntity.updateOrderProps(payloadOrder);
			await this.handleOrderFeedbackSentUsecase.sendPrivateLog({
				order: orderEntity.orderProps,
				discordUserId: orderEntity.customerId,
			});
			await this.handleOrderFeedbackSentUsecase.sendPublicLog({
				order: orderEntity.orderProps,
				discordUserId: orderEntity.customerId,
			});
		}
	}
}
