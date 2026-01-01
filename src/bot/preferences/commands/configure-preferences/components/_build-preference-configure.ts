import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Modal, Context, SlashCommand, SlashCommandContext, Ctx, ModalContext } from "necord";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
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
import { ConfirmDeliveryLogButtonComponent } from "./confirm-delivery-log/_confirm-delivery-log.button";
import { BuildConfirmDeliveryLogSection } from "./confirm-delivery-log/_build-confirm-delivery-section";
import { BuildFeedbackPublicLogSection } from "./feedback-public-log/_build-feedback-public-log-section";
import { FeedbackPublicLogButtonComponent } from "./feedback-public-log/_feedback-public-log.button";
import { FeedbackPrivateLogButtonComponent } from "./feedback-private-log/_feedback-private-log.button";
import { BuildFeedbackPrivateLogSection } from "./feedback-private-log/_build-feedback-private-log-section";

@Injectable()
export class BuildPreferenceConfigure {
	constructor(
		@Inject(forwardRef(() => SalesPrivateLogButtonComponent))
		private readonly salesPrivateLogButtonComponent: SalesPrivateLogButtonComponent,

		@Inject(forwardRef(() => SalesPublicLogButtonComponent))
		private readonly salesPublicLogButtonComponent: SalesPublicLogButtonComponent,

		@Inject(forwardRef(() => FailLogButtonComponent))
		private readonly failLogButtonComponent: WrapperType<FailLogButtonComponent>,

		@Inject(forwardRef(() => ConfirmDeliveryLogButtonComponent))
		private readonly confirmDeliveryLogButtonComponent: WrapperType<ConfirmDeliveryLogButtonComponent>,

		@Inject(forwardRef(() => FeedbackPublicLogButtonComponent))
		private readonly feedbackPublicLogButtonComponent: WrapperType<FeedbackPublicLogButtonComponent>,

		@Inject(forwardRef(() => FeedbackPrivateLogButtonComponent))
		private readonly feedbackPrivateLogButtonComponent: WrapperType<FeedbackPrivateLogButtonComponent>,

		@Inject(forwardRef(() => BuildSalesPrivateLogSection))
		private readonly buildSalesPrivateLogSection: WrapperType<BuildSalesPrivateLogSection>,

		@Inject(forwardRef(() => BuildSalesPublicLogSection))
		private readonly buildSalesPublicLogSection: WrapperType<BuildSalesPublicLogSection>,

		@Inject(forwardRef(() => BuildFailLogSection))
		private readonly buildFailLogSection: WrapperType<BuildFailLogSection>,

		@Inject(forwardRef(() => BuildConfirmDeliveryLogSection))
		private readonly buildConfirmDeliveryLogSection: WrapperType<BuildConfirmDeliveryLogSection>,

		@Inject(forwardRef(() => BuildFeedbackPublicLogSection))
		private readonly buildFeedbackPublicLogSection: WrapperType<BuildFeedbackPublicLogSection>,

		@Inject(forwardRef(() => BuildFeedbackPrivateLogSection))
		private readonly buildFeedbackPrivateLogSection: WrapperType<BuildFeedbackPrivateLogSection>,

		@Inject(Client) private readonly client: Client,
	) {}

	async build({
		section,
	}: {
		section:
			| "MAIN"
			| "SALES_PRIVATE_LOG"
			| "SALES_PUBLIC_LOG"
			| "FAIL_LOG"
			| "CONFIRM_DELIVERY_LOG"
			| "FEEDBACK_PUBLIC_LOG"
			| "FEEDBACK_PRIVATE_LOG";
	}): Promise<string | InteractionReplyOptions | MessagePayload> {
		if (section === "SALES_PRIVATE_LOG") {
			return this.buildSalesPrivateLogSection.build();
		}
		if (section === "SALES_PUBLIC_LOG") {
			return this.buildSalesPublicLogSection.build();
		}

		if (section === "FAIL_LOG") {
			return this.buildFailLogSection.build();
		}

		if (section === "CONFIRM_DELIVERY_LOG") {
			return this.buildConfirmDeliveryLogSection.build();
		}

		if (section === "FEEDBACK_PUBLIC_LOG") {
			return this.buildFeedbackPublicLogSection.build();
		}

		if (section === "FEEDBACK_PRIVATE_LOG") {
			return this.buildFeedbackPrivateLogSection.build();
		}

		const emmbed = new EmbedBuilder()
			.setColor(BotConfig.color)
			.setTitle("Configuração de Preferências")
			.setDescription("Aqui você pode configurar as preferencias do bot como logs, eventos etc.");

		const { salesPrivateLogButton } = await this.salesPrivateLogButtonComponent.createButton();
		const { salesPublicLogButton } = await this.salesPublicLogButtonComponent.createButton();
		const { failLogButton } = await this.failLogButtonComponent.createButton();
		const { confirmDeliveryLogButton } = await this.confirmDeliveryLogButtonComponent.createButton();
		const { feedbackPublicLogButton } = await this.feedbackPublicLogButtonComponent.createButton();
		const { feedbackPrivateLogButton } = await this.feedbackPrivateLogButtonComponent.createButton();

		return {
			embeds: [emmbed],
			components: [
				{
					type: 1,
					components: [
						new ButtonBuilder()
							.setCustomId("title_logs")
							.setLabel("📦 Logs de Vendas")
							.setStyle(ButtonStyle.Primary)
							.setDisabled(true),
						salesPrivateLogButton,
						salesPublicLogButton,
					],
				},

				{
					type: 1,
					components: [
						new ButtonBuilder()
							.setCustomId("title_feedback")
							.setLabel("⭐ Feedback")
							.setStyle(ButtonStyle.Primary)
							.setDisabled(true),
						feedbackPrivateLogButton,
						feedbackPublicLogButton,
					],
				},

				{
					type: 1,
					components: [
						new ButtonBuilder()
							.setCustomId("title_entrega")
							.setLabel("🚚 Entrega e falhas")
							.setStyle(ButtonStyle.Primary)
							.setDisabled(true),
						confirmDeliveryLogButton,
						failLogButton,
					],
				},
			],
			flags: ["Ephemeral"],
		};
	}
}
