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
	StringSelectMenuBuilder,
	TextChannel,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { BotConfig } from "@/config";
import { ProductProps } from "@/@shared/sharpify/api";
import { formatPrice } from "@/@shared/lib";
import TurndownService from "turndown";
import { DiscordUserEntity, EmojiEntity, ProductEntity } from "@/@shared/db/entities";

import { WrapperType } from "@/@shared/types";

import { HandleDiscordMemberNotFound } from "@/@shared/handlers";
import { FindEmojiHelper } from "@/@shared/helpers";
import { getLocalStoreConfig, Sharpify } from "@/@shared/sharpify";
import { BuildFeedbackPublicLogSection } from "./_build-feedback-public-log-section";

@Injectable()
export class MinFeedbackStarButton {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => BuildFeedbackPublicLogSection))
		private readonly buildFeedbackPublicLogSection: WrapperType<BuildFeedbackPublicLogSection>,
	) {}

	@Modal("edit_min_feedback_star_public_log_modal")
	public async onModalSubmit(@Ctx() [interaction]: ModalContext) {
		const discordUser = await DiscordUserEntity.findOneBy({ id: interaction.user.id });
		if (!discordUser) return await HandleDiscordMemberNotFound({ interaction });

		const minStar = parseInt(interaction.fields.getTextInputValue("minStar"));
		if (isNaN(minStar) || minStar < 1 || minStar > 5) {
			return await interaction.reply({
				content: `Por favor, insira um número válido entre 1 e 5 para a estrela mínima.`,
				ephemeral: true,
			});
		}

		const store = await getLocalStoreConfig();
		const preferences = store.getPreferences();
		preferences.feedbackPublicLog.minFeedbackStar = minStar;
		await store.savePreferences(preferences);

		await interaction.reply({
			content: `Estrela mínima de feedback público atualizada para ${minStar}⭐ com sucesso! Quando um feedback for recebido com pelo menos ${minStar}⭐, ele não registrado em nenhum canal.`,
			flags: ["Ephemeral"],
		});
	}

	@Button("edit_min_feedback_star_public_log")
	private async button(@Context() [interaction]: [ButtonInteraction]) {
		const minFeedbackStar = (await getLocalStoreConfig()).getPreferences().feedbackPublicLog.minFeedbackStar || 4;

		const modal = new ModalBuilder()
			.setCustomId(`edit_min_feedback_star_public_log_modal`)
			.setTitle(`Aplicar Estrela Mínima de Feedback. 1⭐ - 5⭐`);

		const starInput = new TextInputBuilder()
			.setCustomId("minStar")
			.setLabel(`Insira o número mínimo de estrelas`)
			.setStyle(TextInputStyle.Short)
			.setValue(minFeedbackStar.toString())
			.setMinLength(1)
			.setMaxLength(50)
			.setRequired(true);

		modal.setComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([starInput]));

		await interaction.showModal(modal);
	}

	async createButton() {
		const minFeedbackStar = (await getLocalStoreConfig()).getPreferences().feedbackPublicLog.minFeedbackStar || 4;

		const minFeedbackStarButton = new ButtonBuilder()
			.setCustomId("edit_min_feedback_star_public_log")
			.setLabel(`Editar estrela mínima | Atual: ${minFeedbackStar}⭐`)
			.setStyle(ButtonStyle.Secondary);

		return { minFeedbackStarButton };
	}
}
