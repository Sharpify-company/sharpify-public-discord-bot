import { ExternalEventsEntity, ProductEntity } from "@/@shared/db/entities";
import { ProductProps } from "@/@shared/sharpify/api";
import { ProductCardComponent } from "@/bot/checkout/components";
import { Inject, Injectable } from "@nestjs/common";
import { Client, TextChannel } from "discord.js";
import {} from "necord";

@Injectable()
export class HandleProductEvent {
	constructor(
		@Inject(Client) private readonly client: Client,
		private readonly productCardComponent: ProductCardComponent,
	) {}

	async create(externalEventEntity: ExternalEventsEntity) {
		const payloadProduct: ProductProps = externalEventEntity.payload as ProductProps;

		const productEntity = await ProductEntity.findOneBy({ id: externalEventEntity.contextAggregateId });
		if (!productEntity) return;

		if (externalEventEntity.eventName === "PRODUCT_DELETED") {
			for (const channelLiked of productEntity.channelsLinked) {
				const channel = (await this.client.channels.fetch(channelLiked.channelId).catch(() => null)) as TextChannel;

				if (!channel || !channel.isTextBased()) continue;
				const message = await channel.messages.fetch(channelLiked.messageId).catch(() => null);
				if (!message) continue;

				await message.delete();
			}

			await productEntity.remove();
		} else if (externalEventEntity.eventName === "PRODUCT_UPDATED") {
			for (const channelLiked of productEntity.channelsLinked) {
				const channel = (await this.client.channels.fetch(channelLiked.channelId).catch(() => null)) as TextChannel;
				if (!channel || !channel.isTextBased()) continue;

				const message = await channel.messages.fetch(channelLiked.messageId).catch(() => null);
				if (!message) continue;

				const reply = await this.productCardComponent.getProductCard(payloadProduct);

				await message.edit({
					embeds: [reply.normalEmmbed],
					components: [reply.normalPurchaseButton],
				});
			}
			await productEntity.updateProps(payloadProduct);
		}
	}
}
