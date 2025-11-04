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
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { BotConfig } from "@/config";
import { ProductProps } from "@/@shared/sharpify/api";
import { formatPrice } from "@/@shared/lib";
import TurndownService from "turndown";

@Injectable()
export class ProductEmmbed {
	createEmbbed(product: ProductProps) {
		return new EmbedBuilder()
			.setColor(BotConfig.color)
			.setTitle(product.info.title)
			.setFields(
				{
					name: "Preço",
					value: `*${formatPrice(product.pricing.price)}*`,
					inline: true,
				},
				{
					name: "Estoque",
					value: `*${product.readonly.stockQuantityAvailable || "Ilimitado"}*`,
					inline: true,
				},
				{
					name: "ID",
					value: `*${product.id || "N/A"}*`,
					inline: true,
				},
			)
			.setDescription(
				product.info.discordDescription ||
					new TurndownService().turndown(product.info.description || "") ||
					"Sem descrição",
			)
			.setImage(product.info.discordMainImage || product.info.mainImage || "");
	}
}
