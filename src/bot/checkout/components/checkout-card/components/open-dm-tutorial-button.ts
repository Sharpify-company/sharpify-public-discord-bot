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
import { formatPrice } from "@/@shared/lib";
import TurndownService from "turndown";
import { DiscordUserEntity, ProductEntity } from "@/@shared/db/entities";
import { ValidateDatabaseCartItemsHelper } from "../../../helpers";
import { formatCheckoutCartItemNameHelper, getCheckoutCartItemsHelper } from "../helper";
import { SectionManagerHandler } from "../section-manager";
import { WrapperType } from "@/@shared/types";
import { RemoveFromCartUsecase } from "../usecases";

@Injectable()
export class OpenDmTutorialButtonComponent {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => SectionManagerHandler))
		private readonly sectionManagerHandler: WrapperType<SectionManagerHandler>,
	) {}

	@Button("open_dm_tutorial_button")
	private async handleButtonClicked(
		@Context() [interaction]: [ButtonInteraction],
		@ComponentParam("productIdAndItemId") productIdAndItemId: string,
	) {
		const OpenDm = new EmbedBuilder()
			.setColor(BotConfig.color)
			.setTitle(`Tutorial Como abrir a DM?`)
			.setDescription("Sem a DM aberta, você não poderá receber o produto comprado pelo discord.")
			.setImage("https://public-blob.squarecloud.dev/498013966740619264/zennify_guides/open_discord_dm_mczscx7n-31ba.webp");

		await interaction.reply({
			embeds: [OpenDm],
			flags: ["Ephemeral"],
		});
	}

	async createButton() {
		const OpenDmTutorialButton = new ButtonBuilder()
			.setCustomId(`open_dm_tutorial_button`)
			.setLabel("Como abrir a DM")
			.setStyle(ButtonStyle.Primary)
			.setEmoji("💬");
		return { OpenDmTutorialButton };
	}
}
