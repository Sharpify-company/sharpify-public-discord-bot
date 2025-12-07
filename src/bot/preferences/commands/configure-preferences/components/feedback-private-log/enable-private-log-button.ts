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
import { BuildFeedbackPrivateLogSection } from "./_build-feedback-private-log-section";

@Injectable()
export class EnableFeedbackPrivateLogButton {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => BuildFeedbackPrivateLogSection))
		private readonly buildFeedbackPrivateLogSection: WrapperType<BuildFeedbackPrivateLogSection>,
	) {}

	@Button("disable_feedback_private_log")
	private async disablePulicLog(@Context() [interaction]: [ButtonInteraction]) {
		const store = await getLocalStoreConfig();
		const preferences = store.getPreferences();
		preferences.feedbackPrivateLog.enabled = false;
		await store.savePreferences(preferences);

		await interaction.update((await this.buildFeedbackPrivateLogSection.build()) as any);
	}

	@Button("enable_feedback_private_log")
	private async enablePrivateLog(@Context() [interaction]: [ButtonInteraction]) {
		const store = await getLocalStoreConfig();
		const preferences = store.getPreferences();
		preferences.feedbackPrivateLog.enabled = true;
		await store.savePreferences(preferences);

		await interaction.update((await this.buildFeedbackPrivateLogSection.build()) as any);
	}

	async createButton() {
		const storeEntity = await getLocalStoreConfig();

		let enableFeedbackPrivateLogButton: ButtonBuilder = null!;
		const preferences = storeEntity.getPreferences();
		if (preferences.feedbackPrivateLog.enabled) {
			enableFeedbackPrivateLogButton = new ButtonBuilder()
				.setCustomId("disable_feedback_private_log")
				.setLabel("Desativar log de feedback Privado")
				.setStyle(ButtonStyle.Danger);
		} else {
			enableFeedbackPrivateLogButton = new ButtonBuilder()
				.setCustomId("enable_feedback_private_log")
				.setLabel("Ativar log de feedback privado")
				.setStyle(ButtonStyle.Success);
		}

		return { enableFeedbackPrivateLogButton };
	}
}
