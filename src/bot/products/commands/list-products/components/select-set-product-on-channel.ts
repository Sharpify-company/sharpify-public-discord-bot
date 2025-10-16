import { Injectable } from "@nestjs/common";
import {
	Modal,
	Context,
	SlashCommand,
	SlashCommandContext,
	Ctx,
	StringSelect,
	StringSelectContext,
	SelectedStrings,
	SelectedChannels,
	ChannelSelect,
	ISelectedChannels,
	ComponentParam,
} from "necord";
import {
	ActionRowBuilder,
	CacheType,
	ChannelSelectMenuBuilder,
	ChannelType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	ModalSubmitInteraction,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { BotConfig } from "@/config";
import { ProductProps } from "@/@shared/sharpify/api";
import { formatPrice } from "@/@shared/lib";
import TurndownService from "turndown";
import { ProductCardComponent } from "@/bot/checkout/components";
import { Sharpify } from "@/@shared/sharpify";
import { getProductRepository } from "@/@shared/db/repositories";
import { ProductEntity } from "@/@shared/db/entities";

@Injectable()
export class SelectSetProductOnChannel {
	constructor(private readonly productCardComponent: ProductCardComponent) {}

	@ChannelSelect("select_set_product_on_channel:productId")
	private async handleChannelSelected(
		@Context() [interaction]: StringSelectContext,
		@SelectedChannels() selected: ISelectedChannels,
		@ComponentParam("productId") productId: string,
	) {
		const channel = interaction.guild?.channels.cache.get(selected?.at(0)!.id);

		if (!channel?.isTextBased()) {
			return interaction.reply({
				content: "O canal selecionado não é um canal de texto válido.",
				flags: ["Ephemeral"],
			});
		}

		const product = await Sharpify.api.v1.catalog.product.get({
			id: productId,
		});

		if (!product.success) {
			return interaction.reply({
				content: `Error ao buscar produto: ${product.errorName}`,
				flags: ["Ephemeral"],
			});
		}

		const productRepository = await getProductRepository();

		let productEntity = await productRepository.findById(product.data.product.id);
		if (!productEntity) {
			productEntity = ProductEntity.create({
				id: product.data.product.id,
				productProps: product.data.product,
			});

			await productRepository.create(productEntity);
		}

		const reply = await this.productCardComponent.sendProductCardToChannel({
			channel: channel as any,
			product: product.data.product,
		});

		productEntity.setChannelLinked({ channelId: channel.id, messageId: reply.id });

		await productRepository.update(productEntity);

		interaction.reply({
			content: "Produto setado no canal com sucesso!",
			flags: ["Ephemeral"],
		});
	}

	createSelectChannel({
		interaction,
		product,
	}: {
		interaction: ChatInputCommandInteraction<CacheType>;
		product: ProductProps;
	}) {
		const selectMenu = new ChannelSelectMenuBuilder()
			.setCustomId(`select_set_product_on_channel${product.id}`)
			.setPlaceholder("Selecione qual canal colocar o produto...")
			.setMaxValues(1)
			.setMinValues(1);
		return new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(selectMenu);
	}
}
