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
export class HandleOrderCancelledUsecase {
	constructor(@Inject(Client) private readonly client: Client) {}

	async execute({ discordUserId }: { discordUserId: string }) {
		const discordUser = await DiscordUserEntity.findOneBy({ id: discordUserId });
		if (!discordUser) return;

		const orderChannel = await this.client.channels.fetch(discordUser.cart.channelId!).catch(() => null);
		orderChannel && (await orderChannel.delete().catch(() => null));

		await discordUser.cart.cancelOrder();
	}
}
