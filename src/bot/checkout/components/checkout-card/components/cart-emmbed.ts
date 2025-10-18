import { Inject, Injectable } from "@nestjs/common";
import { Modal, Context, SlashCommand, SlashCommandContext, Ctx, ModalContext } from "necord";
import {
	ActionRowBuilder,
	CacheType,
	ChatInputCommandInteraction,
	Client,
	EmbedBuilder,
	Message,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	ModalSubmitInteraction,
	TextChannel,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { BotConfig } from "@/config";
import { ProductProps } from "@/@shared/sharpify/api";
import { formatPrice } from "@/@shared/lib";
import TurndownService from "turndown";
import { DiscordUserEntity, EmojiEntity, ProductEntity } from "@/@shared/db/entities";
import { ValidateDatabaseCartItemsHelper } from "../../../helpers";
import { formatCheckoutCartItemNameHelper, getCheckoutCartItemsHelper } from "../helper";
import { getLocalStoreConfig } from "@/@shared/sharpify";
import { FindEmojiHelper } from "@/@shared/helpers";

@Injectable()
export class CartEmmbedComponent {
	constructor(@Inject(Client) private readonly client: Client) {}

	async makeCartEmmbed({ discordUserId }: { discordUserId: string }) {
		await ValidateDatabaseCartItemsHelper({ discordUserId });
		const { name } = await getLocalStoreConfig();

		const discordUserEntity = await DiscordUserEntity.findOneBy({ id: discordUserId });
		if (!discordUserEntity) return { emmbed: new EmbedBuilder().setColor(BotConfig.color).setTitle("Compra") };

		const discordMember = await this.client.users.fetch(discordUserId);
		if (!discordMember) return { emmbed: new EmbedBuilder().setColor(BotConfig.color).setTitle("Compra") };

		const checkoutCartItems = await getCheckoutCartItemsHelper({ discordUserId });

		const productList = checkoutCartItems
			.map(
				(item) =>
					`• \`\`${item.quantity}x ${formatCheckoutCartItemNameHelper(item)} – ${formatPrice(item.item.pricing.price)}\`\``,
			)
			.join("\n");

		const ticketEmoji = await FindEmojiHelper({ client: this.client, name: "Sharpify_ticket" });
		const meneyEmoji = await FindEmojiHelper({ client: this.client, name: "Sharpify_money" });
		const cartEmoji = await FindEmojiHelper({ client: this.client, name: "Sharpify_carrinho" });

		const emmbed = new EmbedBuilder()
			.setColor(BotConfig.color)
			.setTitle(`🛒 Carrinho de compras de ${discordMember.displayName}`)
			.setDescription(`Olá ${discordMember}, aqui está o resumo do seu carrinho de compras:`)
			.addFields(
				{
					name: "📦 **Produtos no carrinho**",
					value: productList.length ? productList : "Seu carrinho está vazio.",
				},
				{
					name: `${meneyEmoji} **Subtotal**`,
					value: "``" + formatPrice(discordUserEntity.cart.subTotalPrice) + "``",
					inline: true,
				},
				{
					name: `${ticketEmoji} **Cupom de desconto**`,
					value:
						"``" +
						(discordUserEntity.cart.couponCode
							? discordUserEntity.cart.couponCode.toUpperCase()
							: "Sem cupom aplicado") +
						"``",
					inline: true,
				},
				{
					name: `${cartEmoji} **Valor total**`,
					value: "``" + formatPrice(discordUserEntity.cart.totalPrice) + "``",
					inline: true,
				},
			)
			.setFooter({
				text: `💼 Sistema de Compra - ©${name} Todos os direitos reservados`,
			});
		return { emmbed };
	}

	async makeSingleCartItemEmmbed({
		discordUserId,
		itemId,
		productId,
	}: {
		discordUserId: string;
		productId: string;
		itemId: string;
	}) {
		const checkoutCartItems = await getCheckoutCartItemsHelper({ discordUserId });
		const { name } = await getLocalStoreConfig();

		const cartItem = checkoutCartItems.find((item) => item.item.id === itemId && item.product.id === productId);
		if (!cartItem) return { emmbed: new EmbedBuilder().setColor(BotConfig.color).setTitle("Compra") };

		const emmbed = new EmbedBuilder()
			.setColor(BotConfig.color)
			.setTitle(`🛒 Gerenciamento do item`)
			.addFields(
				{
					name: "📦 **Nome do produto**",
					value: `• \`\`${formatCheckoutCartItemNameHelper(cartItem)}\`\``,
				},
				{
					name: "🧾 **Subtotal**",
					value: `\`\`${formatPrice(cartItem.item.pricing.price)}\`\``,
					inline: true,
				},
				{
					name: "🏷️ **Quantidade selecionada**",
					value: `\`\`${cartItem.quantity} de ${cartItem.item.inventory.stockQuantity === null ? "Ilimitado" : `${cartItem.item.inventory.stockQuantity} unidades`}\`\``,
					inline: true,
				},
				{
					name: "💰 **Valor total**",
					value: `\`\`${formatPrice(cartItem.item.pricing.price * cartItem.quantity)}\`\``,
					inline: true,
				},
			)
			.setFooter({
				text: `💼 Sistema de Compra - ©${name} Todos os direitos reservados`,
			});
		return { emmbed };
	}
}
