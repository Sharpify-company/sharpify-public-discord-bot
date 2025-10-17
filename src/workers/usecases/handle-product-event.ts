import { ExternalEventsEntity } from "@/@shared/db/entities";
import { getProductRepository } from "@/@shared/db/repositories";
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
		const productRepository = await getProductRepository();
		
		const payloadProduct: ProductProps = externalEventEntity.payload as ProductProps;
		
		const productEntity = await productRepository.findById(externalEventEntity.contextAggregateId);
		if (!productEntity) return;

		if (externalEventEntity.eventName === "PRODUCT_DELETED") {
			for (const channelLiked of productEntity.channelsLinked) {
				const channel = (await this.client.channels.fetch(channelLiked.channelId).catch(() => null)) as TextChannel;

				if (!channel || !channel.isTextBased()) continue;
				const message = await channel.messages.fetch(channelLiked.messageId).catch(() => null);
				if (!message) continue;
				
				await message.delete();
			}

			await productRepository.delete(productEntity.id);
		} else if (externalEventEntity.eventName === "PRODUCT_UPDATED") {
			for (const channelLiked of productEntity.channelsLinked) {
				const channel = (await this.client.channels.fetch(channelLiked.channelId).catch(() => null)) as TextChannel;
				if (!channel || !channel.isTextBased()) continue;

				const message = await channel.messages.fetch(channelLiked.messageId).catch(() => null);
				if (!message) continue;

				const reply = this.productCardComponent.getProductCard(payloadProduct);

				await message.edit({
					embeds: [reply.normalEmmbed],
					components: [reply.normalPurchaseButton],
				});
			}
			productEntity.productProps = payloadProduct;
			await productRepository.update(productEntity);
		}
	}
}
