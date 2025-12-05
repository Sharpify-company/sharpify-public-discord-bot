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
	GuildMember,
	PermissionsBitField,
	TextChannel,
} from "discord.js";
import { dotEnv, formatPrice } from "@/@shared/lib";

import { ValidateDatabaseCartItemsHelper } from "@/bot/checkout/helpers";
import { Inject, Injectable } from "@nestjs/common";
import { DiscordUserEntity, OrderEntity } from "@/@shared/db/entities";
import { get } from "http";
import { BotConfig } from "@/config";
import { OrderProps } from "@/@shared/sharpify/api";

const sentMessages = new Set<string>();

@Injectable()
export class SendPublicSalesLogUsecase {
	constructor(@Inject(Client) private readonly client: Client) {}

	async execute({ discordUserId, orderProps }: SendPublicSalesLogUsecase.Input) {
		if (sentMessages.has(orderProps.shortReference)) return;

		const storePreferences = (await getLocalStoreConfig()).getPreferences();
		if (!storePreferences.publicLogSales.enabled) return;

		const guild = await this.client.guilds.fetch(process.env.DISCORD_GUILD_ID!).catch(() => null);
		if (!guild) return;

		let member: GuildMember | null = null;

		member = discordUserId ? await guild.members.fetch(discordUserId).catch(() => null) : null;
		if (storePreferences.publicLogSales.onlyDiscordSales && !member) return;

		const channel = (await guild.channels.fetch(storePreferences.publicLogSales.channelId!).catch(() => null)) as TextChannel;
		if (!channel || channel.type !== ChannelType.GuildText) return;

		const embed = new EmbedBuilder()
			.setColor(BotConfig.color)
			.setTitle("🛒 Nova compra feita.")
			.setDescription(`Compra feito com successo e com segurança.`);

		embed.addFields([
			{
				name: "`📦` Produto comprados:",
				value: `\`\`\`${orderProps.orderItems.map((item) => `・ ${item.product.backup.title}${item.product.backup.viewType === "DYNAMIC" ? ` > ${item.product.itemBackup?.title}` : ""} (${item.quantity}x)`).join("\n")}\`\`\``,
			},
		]);

		if (member) {
			embed.addFields([
				{
					name: "`👤` Comprador:",
					value: `Muito obrigado  ${member} ❤️`,
				},
			]);
		}

		embed.addFields([
			{
				name: "`🆔` ID do pedido:",
				value: `\`\`\`#${orderProps.shortReference}\`\`\``,
			},
			{
				name: "`📅` Pedido feito em:",
				value: `\`\`\`${new Date(orderProps.createdAt).toLocaleString("pt-br")}\`\`\``,
			},
			{
				name: "`💸` Valor total:",
				value: `\`\`\`${formatPrice(orderProps.pricing.total)}\`\`\``,
			},
		]);

		await channel.send({ embeds: [embed] }).catch((err) => console.log(err));
        sentMessages.add(orderProps.shortReference);
	}
}

export namespace SendPublicSalesLogUsecase {
	export interface Input {
		discordUserId?: string;
		orderProps: OrderProps;
	}
}
