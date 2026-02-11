import { Inject, Injectable } from "@nestjs/common";
import { Modal, Context, SlashCommand, SlashCommandContext, Ctx, ModalContext, Button, ComponentParam } from "necord";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Client, StringSelectMenuBuilder } from "discord.js";
import { BotConfig } from "@/config";
import { ProductProps } from "@/@shared/sharpify/api";
import { formatPrice } from "@/@shared/lib";
import TurndownService from "turndown";
import { EmojiEntity } from "@/@shared/db/entities";

@Injectable()
export class AddToCartButtonComponent {
	constructor(@Inject(Client) private readonly client: Client) {}

	async createDynamicItemsSelect(product: ProductProps) {
		const options = product.dynamicItems
			.map((item) => ({
				label: `${item.info.title}`.slice(0, 100), // Discord limit: 100 characters
				description:
					`💸 Valor: ${formatPrice(item.pricing.price)} | 📦 Estoque ${item.inventory.stockQuantity === null ? "Ilimitado" : `${item.inventory.stockQuantity} unidades`}`.slice(
						0,
						100,
					), // Discord limit: 100 characters
				value: item.id,
				emoji:
					product.readonly.stockQuantityAvailable !== null && product.readonly.stockQuantityAvailable <= 0
						? "❌"
						: "🛒",
			}))
			.slice(0, 25); // Discord limit: 25 options maximum

		// Discord requires at least 1 option
		if (options.length === 0) {
			throw new Error("Cannot create select menu with no options");
		}

		const selectMenu = new StringSelectMenuBuilder()
			.setCustomId(`add_to_cart_${product.id}`)
			.setPlaceholder("Selecione um item...")
			.addOptions(options);

		const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

		return row;
	}

	createCartButton(product: ProductProps) {
		// Cria o botão
		const button = new ButtonBuilder()
			.setCustomId(`add_to_cart_${product.id}:${product.normalItem.id}`)
			.setLabel(`🛒 Adicionar ao carrinho`)
			.setDisabled(product.readonly.stockQuantityAvailable !== null && product.readonly.stockQuantityAvailable <= 0)
			.setStyle(ButtonStyle.Success);

		// Coloca o botão dentro de uma action row
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
		return row;
	}
}
