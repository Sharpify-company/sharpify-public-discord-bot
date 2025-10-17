import { ExternalEventsEntity } from "@/@shared/db/entities";
import { getOrderRepository, getProductRepository } from "@/@shared/db/repositories";
import { OrderProps, ProductProps } from "@/@shared/sharpify/api";
import { ProductCardComponent } from "@/bot/checkout/components";
import { HandleOrderApprovedUsecase } from "@/bot/checkout/components/checkout-card/usecases";
import { Inject, Injectable } from "@nestjs/common";
import { Client, TextChannel } from "discord.js";
import {} from "necord";

@Injectable()
export class HandleCheckoutEvent {
	constructor(
		@Inject(Client) private readonly client: Client,
		private readonly handleOrderApprovedUsecase: HandleOrderApprovedUsecase,
	) {}

	async create(externalEventEntity: ExternalEventsEntity) {
		const orderRepository = await getOrderRepository();

		const payloadOrder: OrderProps = externalEventEntity.payload as OrderProps;

		const orderEntity = await orderRepository.findById(externalEventEntity.contextAggregateId);
		if (!orderEntity) return;

		if (orderEntity.deliveryStatus !== "PENDING") return;

		orderEntity.orderProps = payloadOrder;

		if (externalEventEntity.eventName === "ORDER_APPROVED") {
			await orderRepository.update(orderEntity);
			this.handleOrderApprovedUsecase.execute({ orderId: orderEntity.id });
		}
	}
}
