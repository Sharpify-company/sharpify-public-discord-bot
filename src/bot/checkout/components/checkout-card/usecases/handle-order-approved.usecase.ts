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

import { ValidateDatabaseCartItemsHelper } from "@/bot/checkout/helpers";
import { Inject, Injectable } from "@nestjs/common";
import { DiscordUserEntity, OrderEntity } from "@/@shared/db/entities";

@Injectable()
export class HandleOrderApprovedUsecase {
	constructor(@Inject(Client) private readonly client: Client) {}

	async execute({ orderId }: { orderId: string }) {
		const orderEntity = await OrderEntity.findOneBy({ id: orderId });
		if (!orderEntity) return;

		const discordUser = await DiscordUserEntity.findOneBy({ id: orderEntity.customerId });
		if (!discordUser) return;

		const orderChannel = await this.client.channels.fetch(discordUser.cart.channelId!).catch(() => null);
		orderChannel && (await orderChannel.delete().catch(() => null));

		await orderEntity.markAsPreparingDelivery();
		await discordUser.cart.cancelOrder();
	}
}
