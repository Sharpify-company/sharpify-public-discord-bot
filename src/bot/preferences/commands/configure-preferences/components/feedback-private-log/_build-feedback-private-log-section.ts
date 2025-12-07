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
import { SelectFeedbackPrivateLogChannel } from "./select-public-log-channel-section";
import { WrapperType } from "@/@shared/types";
import { GoBackButtonComponent } from "../go-back-button";
import { EnableFeedbackPrivateLogButton } from "./enable-private-log-button";

@Injectable()
export class BuildFeedbackPrivateLogSection {
	constructor(
		@Inject(forwardRef(() => SelectFeedbackPrivateLogChannel))
		private readonly selectFeedbackPrivateLogChannel: SelectFeedbackPrivateLogChannel,
		@Inject(forwardRef(() => GoBackButtonComponent))
		private readonly goBackButtonComponent: GoBackButtonComponent,
		@Inject(forwardRef(() => EnableFeedbackPrivateLogButton))
		private readonly enableFeedbackPrivateLogButton: EnableFeedbackPrivateLogButton,
		

		@Inject(Client) private readonly client: Client,
	) {}
	async build(): Promise<string | InteractionReplyOptions | MessagePayload> {
		const emmbed = new EmbedBuilder()
			.setColor(BotConfig.color)
			.setTitle("Configurar log de feedback privado")
			.setDescription("Cada alteração vai ser automaticamente refletida no bot.");

		const selectChannel = await this.selectFeedbackPrivateLogChannel.createSelectChannel();
		const { goBackButtonButton } = await this.goBackButtonComponent.createButton();
		const { enableFeedbackPrivateLogButton } = await this.enableFeedbackPrivateLogButton.createButton();

		return {
			embeds: [emmbed],
			components: [
				{
					type: 1,
					components: [enableFeedbackPrivateLogButton, goBackButtonButton],
				},
				selectChannel,
			],
			flags: ["Ephemeral"],
		};
	}
}
