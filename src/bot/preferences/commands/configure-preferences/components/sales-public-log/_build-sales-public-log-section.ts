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
import { SelectSalesPublicLogChannel } from "./select-public-log-channel-section";
import { WrapperType } from "@/@shared/types";
import { GoBackButtonComponent } from "../go-back-button";
import { EnableSalesPublicLogButton } from "./enable-public-log-button";
import { OnlyDiscordSalesPublicLogButton } from "./only-discord-sales.button";

@Injectable()
export class BuildSalesPublicLogSection {
	constructor(
		@Inject(forwardRef(() => SelectSalesPublicLogChannel))
		private readonly selectSalesPublicLogChannel: SelectSalesPublicLogChannel,
		@Inject(forwardRef(() => GoBackButtonComponent))
		private readonly goBackButtonComponent: GoBackButtonComponent,
		@Inject(forwardRef(() => EnableSalesPublicLogButton))
		private readonly enableSalesPublicLogButton: EnableSalesPublicLogButton,
		@Inject(forwardRef(() => OnlyDiscordSalesPublicLogButton))
		private readonly onlyDiscordSalesPublicLogButton: OnlyDiscordSalesPublicLogButton,

		@Inject(Client) private readonly client: Client,
	) {}
	async build(): Promise<string | InteractionReplyOptions | MessagePayload> {
		const emmbed = new EmbedBuilder()
			.setColor(BotConfig.color)
			.setTitle("Configurar log de venda publico")
			.setDescription("Cada alteração vai ser automaticamente refletida no bot.");

		const selectChannel = await this.selectSalesPublicLogChannel.createSelectChannel();
		const { goBackButtonButton } = await this.goBackButtonComponent.createButton();
		const { enableSalesPublicLogButton } = await this.enableSalesPublicLogButton.createButton();
		const { onlyDiscordSalesPublicLogButton } = await this.onlyDiscordSalesPublicLogButton.createButton();

		return {
			embeds: [emmbed],
			components: [
				{
					type: 1,
					components: [enableSalesPublicLogButton, onlyDiscordSalesPublicLogButton, goBackButtonButton],
				},
				selectChannel,
			],
			flags: ["Ephemeral"],
		};
	}
}
