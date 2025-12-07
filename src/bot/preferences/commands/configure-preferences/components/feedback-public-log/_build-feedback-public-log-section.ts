import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Modal, Context, SlashCommand, SlashCommandContext, Ctx, ModalContext } from "necord";
import {
	ActionRowBuilder,
	CacheType,
	ChatInputCommandInteraction,
	Client,
	EmbedBuilder,
	InteractionReplyOptions,
	InteractionResponse,
	MessagePayload,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	ModalSubmitInteraction,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { BotConfig } from "@/config";
import { ProductProps } from "@/@shared/sharpify/api";
import { dotEnv, formatPrice } from "@/@shared/lib";
import TurndownService from "turndown";
import { getLocalStoreConfig } from "@/@shared/sharpify";
import { BuildPreferenceConfigure } from "../_build-preference-configure";
import { SelectFeedbackPublicLogChannel } from "./select-public-log-channel-section";
import { WrapperType } from "@/@shared/types";
import { GoBackButtonComponent } from "../go-back-button";
import { EnableFeedbackPublicLogButton } from "./enable-public-log-button";
import { OnlyDiscordFeebackSalesPublicLogButton } from "./only-discord-sales.button";
import { MinFeedbackStarButton } from "./min-feedback-star";

@Injectable()
export class BuildFeedbackPublicLogSection {
	constructor(
		@Inject(forwardRef(() => SelectFeedbackPublicLogChannel))
		private readonly selectFeedbackPublicLogChannel: SelectFeedbackPublicLogChannel,
		@Inject(forwardRef(() => GoBackButtonComponent))
		private readonly goBackButtonComponent: GoBackButtonComponent,
		@Inject(forwardRef(() => EnableFeedbackPublicLogButton))
		private readonly enableFeedbackPublicLogButton: EnableFeedbackPublicLogButton,
		@Inject(forwardRef(() => OnlyDiscordFeebackSalesPublicLogButton))
		private readonly onlyDiscordFeebackSalesPublicLogButton: OnlyDiscordFeebackSalesPublicLogButton,
		@Inject(forwardRef(() => MinFeedbackStarButton))
		private readonly minFeedbackStarButton: MinFeedbackStarButton,

		

		@Inject(Client) private readonly client: Client,
	) {}
	async build(): Promise<string | InteractionReplyOptions | MessagePayload> {
		const emmbed = new EmbedBuilder()
			.setColor(BotConfig.color)
			.setTitle("Configurar log de feedback publico")
			.setDescription("Cada alteração vai ser automaticamente refletida no bot.");

		const selectChannel = await this.selectFeedbackPublicLogChannel.createSelectChannel();
		const { goBackButtonButton } = await this.goBackButtonComponent.createButton();
		const { enableFeedbackPublicLogButton } = await this.enableFeedbackPublicLogButton.createButton();
		const { onlyDiscordSalesPublicLogButton } = await this.onlyDiscordFeebackSalesPublicLogButton.createButton();
		const { minFeedbackStarButton } = await this.minFeedbackStarButton.createButton();

		return {
			embeds: [emmbed],
			components: [
				{
					type: 1,
					components: [enableFeedbackPublicLogButton, onlyDiscordSalesPublicLogButton, minFeedbackStarButton, goBackButtonButton],
				},
				selectChannel,
			],
			flags: ["Ephemeral"],
		};
	}
}
