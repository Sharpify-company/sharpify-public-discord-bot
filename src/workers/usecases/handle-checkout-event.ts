import { ExternalEventsEntity, OrderEntity } from "@/@shared/db/entities";
import { getLocalStoreConfig } from "@/@shared/sharpify";
import { OrderProps, ProductProps } from "@/@shared/sharpify/api";
import { ProductCardComponent } from "@/bot/checkout/components";
import { HandleOrderApprovedUsecase, HandleOrderCancelledUsecase } from "@/bot/checkout/components/checkout-card/usecases";
import { Inject, Injectable } from "@nestjs/common";
import { Client, TextChannel } from "discord.js";
import {} from "necord";

@Injectable()
export class HandleCheckoutEvent {
	constructor(
		@Inject(Client) private readonly client: Client,
		private readonly handleOrderApprovedUsecase: HandleOrderApprovedUsecase,
		private readonly HandleOrderCancelledUsecase: HandleOrderCancelledUsecase,
	) {}

	async create(externalEventEntity: ExternalEventsEntity) {
		const payloadOrder: OrderProps = externalEventEntity.payload as OrderProps;
		const orderEntity = await OrderEntity.findOneBy({ id: externalEventEntity.contextAggregateId });
		if (!orderEntity) {
			if (externalEventEntity.eventName === "ORDER_APPROVED") {
				if (payloadOrder.customer.info?.platform?.discordId) {
					await this.handleOrderApprovedUsecase.giveRoleToUser({
						discordUserId: payloadOrder.customer.info.platform.discordId,
					});
				}

				await this.handleOrderApprovedUsecase.sendPublicSalesLog({
					orderProps: payloadOrder,
				});

				await this.handleOrderApprovedUsecase.sendPrivateSalesLog({
					orderProps: payloadOrder,
				});
			}
			return;
		}

		if (orderEntity.deliveryStatus !== "PENDING") return;

		if (externalEventEntity.eventName === "ORDER_APPROVED") {
			await orderEntity.updateOrderProps(payloadOrder);
			await this.handleOrderApprovedUsecase.execute({ orderId: orderEntity.id });
		}

		if (externalEventEntity.eventName === "ORDER_CANCELLED") {
			await orderEntity.updateOrderProps(payloadOrder);
			this.HandleOrderCancelledUsecase.execute({ discordUserId: orderEntity.customerId });
		}
	}
}
