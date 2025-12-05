import { getLocalStoreConfig, Sharpify } from "@/@shared/sharpify";
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
import { get } from "http";
import { GiveRoleToUserUsecase } from "./give-role-to-user.usecase";
import { SendPublicSalesLogUsecase } from "./send-public-sales-log.usecase";

@Injectable()
export class HandleOrderApprovedUsecase {
	constructor(
		@Inject(Client) private readonly client: Client,
		private readonly giveRoleToUserUsecase: GiveRoleToUserUsecase,
		private readonly sendPublicSalesLogUsecase: SendPublicSalesLogUsecase,
	) {}

	async giveRoleToUser(input: GiveRoleToUserUsecase.Input) {
		return this.giveRoleToUserUsecase.execute(input);
	}

	async sendPublicSalesLog(input: SendPublicSalesLogUsecase.Input) {
		return this.sendPublicSalesLogUsecase.execute(input);
	}

	async execute({ orderId }: { orderId: string }) {
		const orderEntity = await OrderEntity.findOneBy({ id: orderId });
		if (!orderEntity) return;

		const discordUser = await DiscordUserEntity.findOneBy({ id: orderEntity.customerId });
		if (!discordUser) return;

		const orderChannel = await this.client.channels.fetch(discordUser.cart.channelId!).catch(() => null);
		orderChannel && (await orderChannel.delete().catch(() => null));

		await orderEntity.markAsPreparingDelivery();
		await discordUser.cart.cancelOrder();
		await this.giveRoleToUser({ discordUserId: discordUser.id });
		await this.sendPublicSalesLog({ discordUserId: discordUser.id, orderProps: orderEntity.orderProps });
	}
}
