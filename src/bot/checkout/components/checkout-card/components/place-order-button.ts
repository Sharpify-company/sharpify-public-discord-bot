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
	StringSelectMenuBuilder,
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
import { SectionManagerHandler } from "../section-manager";
import { WrapperType } from "@/@shared/types";
import { RemoveFromCartUsecase } from "../usecases";
import { Sharpify } from "@/@shared/sharpify";

function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

@Injectable()
export class PlaceOrderButtonComponent {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => SectionManagerHandler))
		private readonly sectionManagerHandler: WrapperType<SectionManagerHandler>,
	) {}

	@Modal("place_order_modal")
	public async onModalSubmit(@Ctx() [interaction]: ModalContext) {
		const discordUserRepository = await getDiscordUserRepository();
		const discordUser = await discordUserRepository.findById(interaction.user.id);
		if (!discordUser) {
			await interaction.reply({
				content: "Usuário não encontrado. Por favor, inicie uma compra primeiro.",
				flags: ["Ephemeral"],
			});
			return;
		}

		const firstName = interaction.fields.getTextInputValue("firstNameInput");
		const lastName = interaction.fields.getTextInputValue("lastNameInput");
		const email = interaction.fields.getTextInputValue("emailInput");
		if (!isValidEmail(email)) {
			await interaction.reply({
				content: "Por favor, insira um email válido.",
				flags: ["Ephemeral"],
			});
			return;
		}

		discordUser.firstName = firstName;
		discordUser.lastName = lastName;
		discordUser.email = email;

		await discordUserRepository.update(discordUser);

		interaction.deferUpdate();
		// const result = await this.sectionManagerHandler.setSection({
		// 	discordUserId: interaction.user.id,
		// 	section: "CART_ITEM",
		// 	productId,
		// 	itemId: productItemId,
		// });
		// await interaction.message?.edit(result as any);
	}

	@Button("place_order")
	private async handleButtonClicked(@Context() [interaction]: [ButtonInteraction]) {
		const discordUserRepository = await getDiscordUserRepository();
		const discordUser = await discordUserRepository.findById(interaction.user.id);
		if (!discordUser) {
			await interaction.reply({
				content: "Usuário não encontrado. Por favor, inicie uma compra primeiro.",
				flags: ["Ephemeral"],
			});
			return;
		}

		const modal = new ModalBuilder().setCustomId(`place_order_modal`).setTitle(`Informações para gerar compra`);

		const firstNameInput = new TextInputBuilder()
			.setCustomId("firstNameInput")
			.setLabel(`Nome`)
            .setValue(discordUser.firstName ?? '')
			.setStyle(TextInputStyle.Short)
			.setMinLength(1)
			.setMaxLength(40)
			.setRequired(true);

		const lastNameInput = new TextInputBuilder()
			.setCustomId("lastNameInput")
			.setLabel(`Ultimo nome`)
            .setValue(discordUser.lastName ?? '')
			.setStyle(TextInputStyle.Short)
			.setMinLength(1)
			.setMaxLength(40)
			.setRequired(true);

		const emailInput = new TextInputBuilder()
			.setCustomId("emailInput")
			.setLabel(`Email`)
            .setValue(discordUser.email ?? '')
			.setStyle(TextInputStyle.Short)
			.setMinLength(1)
			.setMaxLength(150)
			.setRequired(true);


		modal.setComponents(
			new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([firstNameInput]),
			new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([lastNameInput]),
			new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([emailInput]),
		);

		await interaction.showModal(modal);
	}

	async createButton() {
		const PlaceOrderButton = new ButtonBuilder()
			.setCustomId(`place_order`) // unique ID to handle clicks
			.setLabel("Finalizar compra") // text on the button
			.setStyle(ButtonStyle.Success) // gray button, like in the image
			.setEmoji("☑️");
		return { PlaceOrderButton };
	}
}
