import { forwardRef, Inject, Injectable } from "@nestjs/common";
import {
	Modal,
	Context,
	SlashCommand,
	SlashCommandContext,
	Ctx,
	ModalContext,
	StringSelect,
	StringSelectContext,
	SelectedStrings,
	Button,
	ComponentParam,
	ModalParam,
} from "necord";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	CacheType,
	ChatInputCommandInteraction,
	Client,
	EmbedBuilder,
	LabelBuilder,
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
import { dotEnv, formatPrice } from "@/@shared/lib";
import TurndownService from "turndown";
import { DiscordUserEntity, EmojiEntity, OrderEntity, ProductEntity } from "@/@shared/db/entities";

import { WrapperType } from "@/@shared/types";
import { Sharpify } from "@/@shared/sharpify";
import { HandleDiscordMemberNotFound } from "@/@shared/handlers";
import { FindEmojiHelper } from "@/@shared/helpers";
import { MemoryCreateConfig } from "../memory-create-config";

@Injectable()
export class CreateConfigButtonComponent {
	constructor(@Inject(Client) private readonly client: Client) {}

	@Modal("config_product_creation_modal:productId")
	public async onModalSubmit(@Ctx() [interaction]: ModalContext, @ModalParam("productId") productId: string) {
		const color = interaction.fields.getTextInputValue("colorInput");

		if (!/^#([A-Fa-f0-9]{1,6})$/.test(color)) {
			return interaction.reply({
				content: `❌ Cor inválida! Por favor, insira um valor hexadecimal válido. Exemplo: #338bff. Com 6 caracteres após o #.`,
				flags: ["Ephemeral"],
			});
		}

		MemoryCreateConfig.set(productId, {
			color,
		});

		await interaction?.reply({
			content: `✅ Configuração criada com sucesso!\nCor da Badge: ${color}`,
			flags: ["Ephemeral"],
		});
	}

	@Button("config_product_creation:productId")
	private async handleButtonClicked(
		@Context() [interaction]: [ButtonInteraction],
		@ComponentParam("productId") productId: string,
	) {
		const Config = MemoryCreateConfig.get(productId);

		const modal = new ModalBuilder()
			.setCustomId(`config_product_creation_modal${productId}`)
			.setTitle(`Configurar criação do produto`);

		const badgeColor = new TextInputBuilder()
			.setCustomId("colorInput")
			.setLabel(`Cor da Badge (Hexadecimal)`)
			.setStyle(TextInputStyle.Short)
			.setMinLength(1)
			.setMaxLength(40)
			.setRequired(true);
		badgeColor.setValue(Config?.color || dotEnv.DEFAULT_COLOR || "#338bff");

		modal.setComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([badgeColor]));

		await interaction.showModal(modal);
	}

	async createButton({ productId }: { productId: string }) {
		const devEmoji = await FindEmojiHelper({ client: this.client, name: "Sharpify_dev" });

		const CreateProductConfigButton = new ButtonBuilder()
			.setCustomId(`config_product_creation${productId}`) // unique ID to handle clicks
			.setLabel(`Configurar criação do produto`) // text on the button
			.setStyle(ButtonStyle.Secondary); // gray button, like in the image
		devEmoji && CreateProductConfigButton.setEmoji({ id: devEmoji.id });
		return { CreateProductConfigButton };
	}
}
