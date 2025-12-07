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
import { BuildFailLogSection } from "./_build-fail-log-section";

@Injectable()
export class EnableFailLogButton {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => BuildFailLogSection))
		private readonly buildFailLogSection: WrapperType<BuildFailLogSection>,
	) {}

	@Button("disable_fail_log")
	private async disablePulicLog(@Context() [interaction]: [ButtonInteraction]) {
		const store = await getLocalStoreConfig();
		const preferences = store.getPreferences();
		preferences.failLog.enabled = false;
		await store.savePreferences(preferences);

		await interaction.update((await this.buildFailLogSection.build()) as any);
	}

	@Button("enable_fail_log")
	private async enablePrivateLog(@Context() [interaction]: [ButtonInteraction]) {
		const store = await getLocalStoreConfig();
		const preferences = store.getPreferences();
		preferences.failLog.enabled = true;
		await store.savePreferences(preferences);

		await interaction.update((await this.buildFailLogSection.build()) as any);
	}

	async createButton() {
		const storeEntity = await getLocalStoreConfig();

		let enableFailLogButton: ButtonBuilder = null!;
		const preferences = storeEntity.getPreferences();
		if (preferences.failLog.enabled) {
			enableFailLogButton = new ButtonBuilder()
				.setCustomId("disable_fail_log")
				.setLabel("Desativar log de falhas")
				.setStyle(ButtonStyle.Danger);
		} else {
			enableFailLogButton = new ButtonBuilder()
				.setCustomId("enable_fail_log")
				.setLabel("Ativar log de falhas")
				.setStyle(ButtonStyle.Success);
		}

		return { enableFailLogButton };
	}
}
