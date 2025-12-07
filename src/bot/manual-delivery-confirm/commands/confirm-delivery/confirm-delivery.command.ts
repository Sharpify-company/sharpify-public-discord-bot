import { Inject, Injectable, Logger, UseInterceptors } from "@nestjs/common";
import { ButtonBuilder, ButtonStyle, Client, EmbedBuilder, Integration, User } from "discord.js";
import { Context, Options, SlashCommand, SlashCommandContext, StringOption, UserOption } from "necord";
import { getLocalStoreConfig, Sharpify } from "@/@shared/sharpify";
import { BotConfig } from "@/config";
import TurndownService from "turndown";
import { dotEnv, formatPrice } from "@/@shared/lib";
import { OrderAutocompleteInterceptor } from "./auto-complete-order.interceptor";
import { OrderEntity } from "@/@shared/db/entities";

export class InputDto {
	@StringOption({
		name: "venda",
		description: "ID da venda a ser confirmada",
		required: true,
		max_length: 100,
		autocomplete: true,
	})
	orderId!: string;

	@StringOption({
		name: "item",
		description: "Item da venda a ser confirmado",
		required: true,
		max_length: 100,
		autocomplete: true,
	})
	orderItemId!: string;

	@UserOption({
		name: "usuario",
		description: "Usuário que recebeu a entrega",
		required: true,
	})
	user!: User;
}

@Injectable()
export class ConfirmDeliveryCommand {
	constructor(@Inject(Client) private readonly client: Client) {}

	@UseInterceptors(OrderAutocompleteInterceptor)
	@SlashCommand({
		name: "confirmar-entrega",
		description: "Mande um log publico de confirmação de entrega de um produto!",
		defaultMemberPermissions: ["Administrator"],
	})
	public async onListOrder(@Context() [interaction]: SlashCommandContext, @Options() { orderId, orderItemId, user }: InputDto) {
		const order = await Sharpify.api.v1.checkout.order.getOrder({
			orderId,
		});

		if (!order.success) {
			return interaction.reply({
				content: `Error ao buscar a venda: ${order.errorName}`,
				flags: ["Ephemeral"],
			});
		}

		const orderItem = order.data.order.orderItems.find((item) => item.id === orderItemId);

		if (!orderItem) {
			return interaction.reply({
				content: `Error ao buscar o item da venda.`,
				flags: ["Ephemeral"],
			});
		}

		const storeEntity = await getLocalStoreConfig();

		const preferences = storeEntity.getPreferences();

		if (!preferences.confirmDelivery.enabled) {
			return interaction.reply({
				content: `O log publico de confirmação de entrega não está habilitado nas preferências da loja.`,
				flags: ["Ephemeral"],
			});
		}

		const guild = await this.client.guilds.fetch(dotEnv.DISCORD_GUILD_ID).catch(() => null);
		if (!guild) {
			return interaction.reply({
				content: `Error ao buscar o servidor do Discord.`,
				flags: ["Ephemeral"],
			});
		}

		const channel = await guild.channels.fetch(preferences.confirmDelivery.channelId!).catch(() => null);
		if (!channel || !channel.isTextBased()) {
			return interaction.reply({
				content: `Error ao buscar o canal de log publico de confirmação de entrega.`,
				flags: ["Ephemeral"],
			});
		}

		const emmbed = new EmbedBuilder()
			.setColor(BotConfig.color)
			.setTitle("Entrega Confirmada!")
			.setDescription(
				`Pedido entregue pelo administrador ${interaction.user} para o cliente ${user}.`,
			);

		const productName =
			orderItem.product.backup.viewType === "NORMAL"
				? orderItem.product.backup.title
				: `${orderItem.product.backup.title} > ${orderItem.product.itemBackup.title}`;

		emmbed.addFields(
			{ name: "🆔 Referência", value: `\`\`\`#${order.data.order.shortReference}\`\`\``, inline: false },
			{ name: "🌐 Produto", value: `\`\`\`${productName}\`\`\``, inline: true },
			{ name: "📦 Quantidade", value: `\`\`\`${orderItem.quantity}\`\`\``, inline: true },
		);

		const viewProductButton = new ButtonBuilder()
			.setLabel("Visualizar produto no site")
			.setStyle(ButtonStyle.Link)
			.setURL(`${storeEntity.url}/product/${orderItem.product.productId}`);

		await channel.send({
			content: `${user}`,
			embeds: [emmbed],
			components: [{ type: 1, components: [viewProductButton] }],
		});

		return interaction.reply({
			content: `Confirmação de entrega enviada com sucesso para o canal ${channel}.`,
			flags: ["Ephemeral"],
		});
	}
}
