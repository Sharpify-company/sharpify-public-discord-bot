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
import { DiscordUserEntity, ProductEntity } from "@/@shared/db/entities";
import { getDiscordUserRepository, getProductRepository } from "@/@shared/db/repositories";
import { ValidateDatabaseCartItemsHelper } from "../../../helpers";
import { formatCheckoutCartItemNameHelper, getCheckoutCartItemsHelper } from "../helper";

@Injectable()
export class CartEmmbedComponent {
	constructor(@Inject(Client) private readonly client: Client) {}

	async makeCartEmmbed({ discordUserId }: { discordUserId: string }) {
		const discordUserRepository = await getDiscordUserRepository();
		const productRepository = await getProductRepository();

		await ValidateDatabaseCartItemsHelper({ discordUserId });

		const discordUserEntity = await discordUserRepository.findById(discordUserId);
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
					name: "🧾 **Subtotal**",
					value: "``" + formatPrice(discordUserEntity.subTotalPrice) + "``",
					inline: true,
				},
				{
					name: "🏷️ **Cupom de desconto**",
					value: "``" + (discordUserEntity.couponCode ? discordUserEntity.couponCode.toUpperCase() : "Sem cupom aplicado") + "``",
					inline: true,
				},
				{
					name: "💰 **Valor total**",
					value: "``" + formatPrice(discordUserEntity.totalPrice) + "``",
					inline: true,
				},
			)
			.setFooter({
				text: "💼 Sistema de Compra - © Todos os direitos reservados",
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
				text: "💼 Sistema de Compra - © Todos os direitos reservados",
			});
		return { emmbed };
	}
}
