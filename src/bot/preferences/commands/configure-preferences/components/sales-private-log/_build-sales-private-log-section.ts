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
import { SelectSalesPrivateLogChannel } from "./select-private-log-channel-section";
import { WrapperType } from "@/@shared/types";
import { GoBackButtonComponent } from "../go-back-button";
import { EnableSalesPrivateLogButton } from "./enable-private-log-button";
import { OnlyDiscordSalesPrivateLogButton } from "./only-discord-sales.button";

@Injectable()
export class BuildSalesPrivateLogSection {
	constructor(
		@Inject(forwardRef(() => SelectSalesPrivateLogChannel))
		private readonly selectSalesPrivateLogChannel: SelectSalesPrivateLogChannel,
		@Inject(forwardRef(() => GoBackButtonComponent))
		private readonly goBackButtonComponent: GoBackButtonComponent,
		@Inject(forwardRef(() => EnableSalesPrivateLogButton))
		private readonly enableSalesPrivateLogButton: EnableSalesPrivateLogButton,
		@Inject(forwardRef(() => OnlyDiscordSalesPrivateLogButton))
		private readonly onlyDiscordSalesPrivateLogButton: OnlyDiscordSalesPrivateLogButton,
		@Inject(Client) private readonly client: Client,
	) {}
	async build(): Promise<string | InteractionReplyOptions | MessagePayload> {
		const emmbed = new EmbedBuilder()
			.setColor(BotConfig.color)
			.setTitle("Configurar log de venda privado")
			.setDescription("Cada alteração vai ser automaticamente refletida no bot.");

		const selectChannel = await this.selectSalesPrivateLogChannel.createSelectChannel();
		const { goBackButtonButton } = await this.goBackButtonComponent.createButton();
		const { enableSalesPrivateLogButton } = await this.enableSalesPrivateLogButton.createButton();
		const { onlyDiscordSalesPrivateLogButton } = await this.onlyDiscordSalesPrivateLogButton.createButton();

		return {
			embeds: [emmbed],
			components: [
				{
					type: 1,
					components: [enableSalesPrivateLogButton, onlyDiscordSalesPrivateLogButton, goBackButtonButton],
				},
				selectChannel,
			],
			flags: ["Ephemeral"],
		};
	}
}
