import { Injectable } from "@nestjs/common";
import { Modal, Context, SlashCommand, SlashCommandContext, Ctx, ModalContext } from "necord";
import {
	ActionRowBuilder,
	CacheType,
	ChatInputCommandInteraction,
	EmbedBuilder,
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
import { AddToCartButtonComponent } from "./components/add-to-cart-button";
import { MemoryCreateConfig } from "@/bot/products/commands/list-products/memory-create-config";

@Injectable()
export class ProductCardComponent {
	constructor(private readonly addToCartButtonComponent: AddToCartButtonComponent) {}

	private getProductEmbed(product: ProductProps) {

		const emmbed = new EmbedBuilder()
			.setColor(MemoryCreateConfig.get(product.id)?.color || BotConfig.color)
			.setTitle("Sistema de compra")
			.setDescription(
				product.info.discordDescription ||
					new TurndownService().turndown(product.info.description || "") ||
					"Sem descrição",
			)
			.setImage(product.info.mainImage || "");

		if (product.settings.viewType === "NORMAL") {
			emmbed.addFields(
				{ name: "🌐 Produto", value: `\`\`\`${product.info.title}\`\`\`` },
				{
					name: "💵 Valor",
					value: `\`\`\`${formatPrice(product.pricing.price)}\`\`\``,
					inline: true,
				},
				{
					name: "📦 Estoque disponível pra compra",
					value:
						product.readonly.stockQuantityAvailable === null
							? `\`\`\`∞ Ilimitado\`\`\``
							: `\`\`\`${product.readonly.stockQuantityAvailable} Unidades\`\`\``,
					inline: true,
				},
			);
		}
		return emmbed;
	}

	async getProductCard(product: ProductProps) {
		const normalEmmbed = this.getProductEmbed(product);
		const normalPurchaseButton =
			product.settings.viewType === "NORMAL"
				? this.addToCartButtonComponent.createCartButton(product)
				: await this.addToCartButtonComponent.createDynamicItemsSelect(product);

		return { normalEmmbed, normalPurchaseButton };
	}

	async sendProductCardToChannel({ channel, product }: { product: ProductProps; channel: TextChannel }) {
		const { normalEmmbed, normalPurchaseButton } = await this.getProductCard(product);

		const reply = await channel.send({
			embeds: [normalEmmbed],
			components: [normalPurchaseButton],
		});
		return reply;
	}
}
