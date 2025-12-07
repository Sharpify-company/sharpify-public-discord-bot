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
import { SelectFailLogChannel } from "./select-fail-log-channel-section";
import { WrapperType } from "@/@shared/types";
import { GoBackButtonComponent } from "../go-back-button";
import { EnableFailLogButton } from "./enable-fail-log-button";

@Injectable()
export class BuildFailLogSection {
	constructor(
		@Inject(forwardRef(() => SelectFailLogChannel))
		private readonly selectFailLogChannel: SelectFailLogChannel,
		@Inject(forwardRef(() => GoBackButtonComponent))
		private readonly goBackButtonComponent: GoBackButtonComponent,
		@Inject(forwardRef(() => EnableFailLogButton))
		private readonly enableFailLogButton: EnableFailLogButton,

		@Inject(Client) private readonly client: Client,
	) {}
	async build(): Promise<string | InteractionReplyOptions | MessagePayload> {
		const emmbed = new EmbedBuilder().setColor(BotConfig.color).setTitle("Configurar log de falhas").setDescription(`
Cada alteração vai ser automaticamente refletida no bot.
Cada falha em uma venda será registrada neste canal.
Como exemplo: falhas de pagamento, erros na entrega do produto na DM, etc.
		`);

		const selectChannel = await this.selectFailLogChannel.createSelectChannel();
		const { goBackButtonButton } = await this.goBackButtonComponent.createButton();
		const { enableFailLogButton } = await this.enableFailLogButton.createButton();

		return {
			embeds: [emmbed],
			components: [
				{
					type: 1,
					components: [enableFailLogButton, goBackButtonButton],
				},
				selectChannel,
			],
			flags: ["Ephemeral"],
		};
	}
}
