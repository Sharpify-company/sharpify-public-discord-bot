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
import { OrderProps } from "@/@shared/sharpify/api";
import { BotConfig } from "@/config";

const sentMessages = new Set<string>();
const sentPublicMessages = new Set<string>();

@Injectable()
export class HandleOrderFeedbackSentUsecase {
	constructor(@Inject(Client) private readonly client: Client) {}

	async sendPrivateLog({ order, discordUserId }: { order: OrderProps; discordUserId?: string }) {
		if (order.feedback.status !== "SENT") return;

		if (sentMessages.has(order.shortReference)) return;
		const storeEntity = await getLocalStoreConfig();
		const storePreferences = storeEntity.getPreferences();
		if (!storePreferences.feedbackPrivateLog.enabled) return;

		const guild = await this.client.guilds.fetch(process.env.DISCORD_GUILD_ID!).catch(() => null);
		if (!guild) return;

		let member: GuildMember | null = null;

		member = discordUserId ? await guild.members.fetch(discordUserId).catch(() => null) : null;

		const channel = (await guild.channels
			.fetch(storePreferences.feedbackPrivateLog.channelId!)
			.catch(() => null)) as TextChannel;
		if (!channel || channel.type !== ChannelType.GuildText) return;

		const embed = new EmbedBuilder()
			.setColor(BotConfig.color)
			.setTitle("⭐ Feedback enviado. (Log privado)")
			.setDescription(`Feedback envidado pelo cliente, veja as informações.`);

		embed.addFields([
			{
				name: "`🆔` Referência do pedido:",
				value: `\`\`\`#${order.shortReference}\`\`\``,
			},
		]);

		embed.addFields([
			{
				name: `Email:`,
				value: `\`\`\`${order.customer.email}\`\`\``,
			},
			{
				name: "`📅` Enviado em:",
				value: `\`\`\`${new Date(order.feedback.sentAt).toLocaleString("pt-br")}\`\`\``,
				inline: true,
			},
			{
				name: "`💸` Valor do pedido:",
				value: `\`\`\`${formatPrice(order.pricing.total)}\`\`\``,
				inline: true,
			},
			{
				name: `\`⭐\` Estrelas (${order.feedback.rating} de 5):`,
				value: ``,
			},
			{
				name: `Comentario:`,
				value: `\`\`\`${order.feedback.content || "Nenhum comentario fornecido."}\`\`\``,
			},
		]);

		if (member) {
			embed.addFields([
				{
					name: "`👤` Comprador:",
					value: `${member} (\`${member.user.tag}\`)`,
				},
			]);
		}

		const viewOnWebsiteButton = new ButtonBuilder()
			.setLabel(`Visualizar no site`)
			.setStyle(ButtonStyle.Link)
			.setURL(`${storeEntity.url}/checkout/${order.id}`);

		await channel
			.send({ embeds: [embed], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(viewOnWebsiteButton)] })
			.catch((err) => console.log(err));

		sentMessages.add(order.shortReference);
	}

	async sendPublicLog({ order, discordUserId }: { order: OrderProps; discordUserId?: string }) {
		if (order.feedback.status !== "SENT") return;

		if (sentPublicMessages.has(order.shortReference)) return;
		const storeEntity = await getLocalStoreConfig();
		const storePreferences = storeEntity.getPreferences();
		if (!storePreferences.feedbackPublicLog.enabled) return;

		const minStars = storePreferences.feedbackPublicLog.minFeedbackStar || 4;

		if (order.feedback.rating < minStars) return;

		const guild = await this.client.guilds.fetch(process.env.DISCORD_GUILD_ID!).catch(() => null);
		if (!guild) return;

		let member: GuildMember | null = null;

		member = discordUserId ? await guild.members.fetch(discordUserId).catch(() => null) : null;
		if (storePreferences.feedbackPublicLog.onlyDiscordSales && !member) return;

		const channel = (await guild.channels
			.fetch(storePreferences.feedbackPublicLog.channelId!)
			.catch(() => null)) as TextChannel;
		if (!channel || channel.type !== ChannelType.GuildText) return;

		const embed = new EmbedBuilder()
			.setColor(BotConfig.color)
			.setTitle("⭐ Feedback enviado")
			.setDescription(`Feedback envidado pelo cliente${member ? ` ${member}` : ""}, veja as informações.`);

		embed.addFields([
			{
				name: "`🆔` Referência do pedido:",
				value: `\`\`\`#${order.shortReference}\`\`\``,
			},
		]);

		embed.addFields([
			{
				name: "`📅` Enviado em:",
				value: `\`\`\`${new Date(order.feedback.sentAt).toLocaleString("pt-br")}\`\`\``,
				inline: true,
			},
			{
				name: `\`⭐\` Estrelas (${order.feedback.rating} de 5):`,
				value: ``,
			},
			{
				name: `Comentario:`,
				value: `\`\`\`${order.feedback.content || "Nenhum comentario fornecido."}\`\`\``,
			},
		]);

		await channel.send({ embeds: [embed] }).catch((err) => console.log(err));

		sentPublicMessages.add(order.shortReference);
	}
}
