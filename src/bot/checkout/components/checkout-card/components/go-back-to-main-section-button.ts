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

@Injectable()
export class GoBackToMainSectionButionComponent {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => SectionManagerHandler))
		private readonly sectionManagerHandler: WrapperType<SectionManagerHandler>,
	) {}

	@Button("go_back_to_checkout_main_section")
	private async handleButtonClicked(@Context() [interaction]: [ButtonInteraction]) {
		const result = await this.sectionManagerHandler.setSection({
			discordUserId: interaction.user.id,
			section: "MAIN",
		});
        await interaction.deferUpdate();
        await interaction.message.edit(result as any);
	}

	async createButton() {
		const backToSummaryButton = new ButtonBuilder()
			.setCustomId("go_back_to_checkout_main_section") // unique ID to handle clicks
			.setLabel("Voltar ao resumo do pedido")
			.setStyle(ButtonStyle.Secondary) // gray button, like in the image
			.setEmoji("⬅"); 
		return { backToSummaryButton };
	}
}
