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
export class EnableFeedbackPublicLogButton {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => BuildFeedbackPublicLogSection))
		private readonly buildFeedbackPublicLogSection: WrapperType<BuildFeedbackPublicLogSection>,
	) {}

	@Button("disable_feedback_public_log")
	private async disablePulicLog(@Context() [interaction]: [ButtonInteraction]) {
		const store = await getLocalStoreConfig();
		const preferences = store.getPreferences();
		preferences.feedbackPublicLog.enabled = false;
		await store.savePreferences(preferences);

		await interaction.update((await this.buildFeedbackPublicLogSection.build()) as any);
	}

	@Button("enable_feedback_public_log")
	private async enablePrivateLog(@Context() [interaction]: [ButtonInteraction]) {
		const store = await getLocalStoreConfig();
		const preferences = store.getPreferences();
		preferences.feedbackPublicLog.enabled = true;
		await store.savePreferences(preferences);

		await interaction.update((await this.buildFeedbackPublicLogSection.build()) as any);
	}

	async createButton() {
		const storeEntity = await getLocalStoreConfig();

		let enableFeedbackPublicLogButton: ButtonBuilder = null!;
		const preferences = storeEntity.getPreferences();
		if (preferences.feedbackPublicLog.enabled) {
			enableFeedbackPublicLogButton = new ButtonBuilder()
				.setCustomId("disable_feedback_public_log")
				.setLabel("Desativar log de feedback publico")
				.setStyle(ButtonStyle.Danger);
		} else {
			enableFeedbackPublicLogButton = new ButtonBuilder()
				.setCustomId("enable_feedback_public_log")
				.setLabel("Ativar log de feedback publico")
				.setStyle(ButtonStyle.Success);
		}

		return { enableFeedbackPublicLogButton };
	}
}
