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
import { BuildSalesPublicLogSection } from "./_build-sales-public-log-section";

@Injectable()
export class OnlyDiscordSalesPublicLogButton {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => BuildSalesPublicLogSection))
		private readonly buildSalesPublicLogSection: WrapperType<BuildSalesPublicLogSection>,
	) {}

	@Button("disable_only_discord_sales_public_log")
	private async disablePulicLog(@Context() [interaction]: [ButtonInteraction]) {
		const store = await getLocalStoreConfig();
		const preferences = store.getPreferences();
		preferences.publicLogSales.onlyDiscordSales = false;
		await store.savePreferences(preferences);

		await interaction.update((await this.buildSalesPublicLogSection.build()) as any);
	}

	@Button("enable_only_discord_sales_public_log")
	private async enablePrivateLog(@Context() [interaction]: [ButtonInteraction]) {
		const store = await getLocalStoreConfig();
		const preferences = store.getPreferences();
		preferences.publicLogSales.onlyDiscordSales = true;
		await store.savePreferences(preferences);

		await interaction.update((await this.buildSalesPublicLogSection.build()) as any);
	}

	async createButton() {
		const storeEntity = await getLocalStoreConfig();

		let onlyDiscordSalesPublicLogButton: ButtonBuilder = null!;
		const preferences = storeEntity.getPreferences();
		if (preferences.publicLogSales.onlyDiscordSales) {
			onlyDiscordSalesPublicLogButton = new ButtonBuilder()
				.setCustomId("disable_only_discord_sales_public_log")
				.setLabel("Desativar somente vendas feita pelo Discord")
				.setStyle(ButtonStyle.Danger);
		} else {
			onlyDiscordSalesPublicLogButton = new ButtonBuilder()
				.setCustomId("enable_only_discord_sales_public_log")
				.setLabel("Ativar somente vendas feita pelo Discord")
				.setStyle(ButtonStyle.Success);
		}

		return { onlyDiscordSalesPublicLogButton };
	}
}
