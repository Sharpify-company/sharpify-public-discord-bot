import { Sharpify } from "@/@shared/sharpify";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	CacheType,
	ChannelType,
	Client,
	EmbedBuilder,
	PermissionsBitField,
} from "discord.js";
import { dotEnv } from "@/@shared/lib";
import { getDiscordUserRepository, getOrderRepository } from "@/@shared/db/repositories";

import { ValidateDatabaseCartItemsHelper } from "@/bot/checkout/helpers";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class HandleOrderApprovedUsecase {
	constructor(@Inject(Client) private readonly client: Client) {}

	async execute({ orderId }: { orderId: string }) {
		const discordUserRepository = await getDiscordUserRepository();
		const orderRepository = await getOrderRepository();

		const orderEntity = await orderRepository.findById(orderId);
		if (!orderEntity) return;

		const discordUser = await discordUserRepository.findById(orderEntity.customerId);
		if (!discordUser) return;

		const orderChannel = await this.client.channels.fetch(discordUser.cartChannelId!).catch(() => null);
		if (orderChannel) {
			await orderChannel.delete().catch(() => null);
		}

		orderEntity.deliveryStatus = "PREPARING_DELIVERY";

		discordUser.clearOrderData();

		await discordUserRepository.update(discordUser);
		await orderRepository.update(orderEntity);
	}
}
