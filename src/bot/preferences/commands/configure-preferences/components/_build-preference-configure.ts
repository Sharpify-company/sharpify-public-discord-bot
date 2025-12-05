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
import { SalesPrivateLogButtonComponent } from "./sales-private-log/_sales-private-log.button";
// import { EnablePublicLogButtonComponent } from "./enable-public-log.button";
import { WrapperType } from "@/@shared/types";
import { BuildSalesPrivateLogSection } from "./sales-private-log/_build-sales-private-log-section";
import { SalesPublicLogButtonComponent } from "./sales-public-log/_sales-public-log.button";
import { BuildSalesPublicLogSection } from "./sales-public-log/_build-sales-public-log-section";
import { FailLogButtonComponent } from "./fail-log/_fail-log.button";
import { BuildFailLogSection } from "./fail-log/_build-fail-log-section";

@Injectable()
export class BuildPreferenceConfigure {
	constructor(
		@Inject(forwardRef(() => SalesPrivateLogButtonComponent))
		private readonly salesPrivateLogButtonComponent: SalesPrivateLogButtonComponent,

		@Inject(forwardRef(() => SalesPublicLogButtonComponent))
		private readonly salesPublicLogButtonComponent: SalesPublicLogButtonComponent,

		@Inject(forwardRef(() => FailLogButtonComponent))
		private readonly failLogButtonComponent: WrapperType<FailLogButtonComponent>,

		@Inject(forwardRef(() => BuildSalesPrivateLogSection))
		private readonly buildSalesPrivateLogSection: WrapperType<BuildSalesPrivateLogSection>,

		@Inject(forwardRef(() => BuildSalesPublicLogSection))
		private readonly buildSalesPublicLogSection: WrapperType<BuildSalesPublicLogSection>,

		@Inject(forwardRef(() => BuildFailLogSection))
		private readonly buildFailLogSection: WrapperType<BuildFailLogSection>,

		@Inject(Client) private readonly client: Client,
	) {}

	async build({
		section,
	}: {
		section: "MAIN" | "PRIVATE_LOG" | "PUBLIC_LOG" | "FAIL_LOG";
	}): Promise<string | InteractionReplyOptions | MessagePayload> {
		if (section === "PRIVATE_LOG") {
			return this.buildSalesPrivateLogSection.build();
		}
		if (section === "PUBLIC_LOG") {
			return this.buildSalesPublicLogSection.build();
		}

		if (section === "FAIL_LOG") {
			return this.buildFailLogSection.build();
		}

		const emmbed = new EmbedBuilder()
			.setColor(BotConfig.color)
			.setTitle("Configuração de Preferências")
			.setDescription("Aqui você pode configurar as preferencias do bot como logs, eventos etc.");

		const { salesPrivateLogButton } = await this.salesPrivateLogButtonComponent.createButton();
		const { salesPublicLogButton } = await this.salesPublicLogButtonComponent.createButton();
		const { failLogButton } = await this.failLogButtonComponent.createButton();

		return {
			embeds: [emmbed],
			components: [
				{
					type: 1,
					components: [salesPrivateLogButton, salesPublicLogButton, failLogButton],
				},
			],
			flags: ["Ephemeral"],
		};
	}
}
