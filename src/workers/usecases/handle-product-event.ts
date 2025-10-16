import { ExternalEventsEntity } from "@/@shared/db/entities";
import { getProductRepository } from "@/@shared/db/repositories";
import { ProductProps } from "@/@shared/sharpify/api";
import { Inject, Injectable } from "@nestjs/common";
import { Client, TextChannel } from "discord.js";
import {} from "necord";

@Injectable()
export class HandleProductEvent {
	constructor(@Inject(Client) private readonly client: Client) {}

	async create(externalEventEntity: ExternalEventsEntity) {
		const productRepository = await getProductRepository();

		const payloadProduct: ProductProps = externalEventEntity.payload as ProductProps;

		const productEntity = await productRepository.findById(externalEventEntity.contextAggregateId);
		if (!productEntity) return;

		if (externalEventEntity.eventName === "PRODUCT_DELETED") {
			for (const channelLiked of productEntity.channelsLinked) {
				const channel = this.client.channels.cache.get(channelLiked.channelId) as TextChannel;

				if (!channel || !channel.isTextBased()) continue;
				const message = await channel.messages.fetch(channelLiked.messageId);

				if (!message) continue;
				await message.delete();
			}

			await productRepository.delete(productEntity.id);
		} else {
			productEntity.productProps = payloadProduct;
			await productRepository.update(productEntity);
		}
	}
}
