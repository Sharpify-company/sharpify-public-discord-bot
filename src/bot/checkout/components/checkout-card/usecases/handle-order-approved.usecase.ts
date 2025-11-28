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

@Injectable()
export class HandleOrderApprovedUsecase {
	constructor(@Inject(Client) private readonly client: Client) {}

	async giveRoleToUser({ discordUserId }: { discordUserId: string }) {
		const guild = await this.client.guilds.fetch(process.env.DISCORD_GUILD_ID!).catch(() => null);
		if (!guild) return;

		const member = await guild.members.fetch(discordUserId).catch(() => null);
		if (!member) return;

		const store = await getLocalStoreConfig();
		const rolesToGive = store?.applyRolesSettings || [];
		for (const roleToGive of rolesToGive) {
			const role = await guild.roles.fetch(roleToGive.roleId).catch(() => null);
			if (!role) continue;
			const result = await member.roles.add(role).catch((err) => {
				console.log(err);
				return null;
			});
		}
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
	}
}
