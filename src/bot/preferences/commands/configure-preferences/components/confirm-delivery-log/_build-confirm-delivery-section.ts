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
import { SelectConfirmDeliveryLogChannel } from "./select-confirm-delivery-log-channel-section";
import { WrapperType } from "@/@shared/types";
import { GoBackButtonComponent } from "../go-back-button";
import { EnableConfirmDeliveryLogButton } from "./enable-confirm-delivery-log-button";

@Injectable()
export class BuildConfirmDeliveryLogSection {
	constructor(
		@Inject(forwardRef(() => SelectConfirmDeliveryLogChannel))
		private readonly selectConfirmDeliveryLogChannel: SelectConfirmDeliveryLogChannel,
		@Inject(forwardRef(() => GoBackButtonComponent))
		private readonly goBackButtonComponent: GoBackButtonComponent,
		@Inject(forwardRef(() => EnableConfirmDeliveryLogButton))
		private readonly enableConfirmDeliveryLogButton: EnableConfirmDeliveryLogButton,

		@Inject(Client) private readonly client: Client,
	) {}
	async build(): Promise<string | InteractionReplyOptions | MessagePayload> {
		const emmbed = new EmbedBuilder()
			.setColor(BotConfig.color)
			.setTitle("Configurar log de confirmação de entrega")
			.setDescription("Cada alteração vai ser automaticamente refletida no bot.");

		const selectChannel = await this.selectConfirmDeliveryLogChannel.createSelectChannel();
		const { goBackButtonButton } = await this.goBackButtonComponent.createButton();
		const { enableConfirmDeliveryLogButton } = await this.enableConfirmDeliveryLogButton.createButton();

		return {
			embeds: [emmbed],
			components: [
				{
					type: 1,
					components: [enableConfirmDeliveryLogButton, goBackButtonButton],
				},
				selectChannel,
			],
			flags: ["Ephemeral"],
		};
	}
}
