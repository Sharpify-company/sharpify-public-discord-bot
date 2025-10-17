import { Injectable } from "@nestjs/common";
import { Modal, Context, SlashCommand, SlashCommandContext, Ctx, ModalContext, Button, ComponentParam } from "necord";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, StringSelectMenuBuilder } from "discord.js";
import { BotConfig } from "@/config";
import { ProductProps } from "@/@shared/sharpify/api";
import { formatPrice } from "@/@shared/lib";
import TurndownService from "turndown";

@Injectable()
export class AddToCartButtonComponent {
	createDynamicItemsSelect(product: ProductProps) {
		const options = product.dynamicItems.map((item) => ({
			label: `${item.info.title}`,
			description: `💸 Valor: ${formatPrice(item.pricing.price)} | 📦 Estoque ${item.inventory.stockQuantity === null ? "Ilimitado" : `${item.inventory.stockQuantity} unidades`}`,
			value: item.id,
			emoji: product.readonly.stockQuantityAvailable !== null && product.readonly.stockQuantityAvailable <= 0 ? "❌" : "🛒",
		}));

		const selectMenu = new StringSelectMenuBuilder()
			.setCustomId(`add_to_cart_${product.id}`)
			.setPlaceholder("Selecione um item...")
			.addOptions(options)

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
