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
import { BuildSalesPrivateLogSection } from "./_build-sales-private-log-section";

@Injectable()
export class EnableSalesPrivateLogButton {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => BuildSalesPrivateLogSection))
		private readonly buildSalesPrivateLogSection: WrapperType<BuildSalesPrivateLogSection>,
	) {}

	@Button("disable_sales_private_log")
	private async disablePulicLog(@Context() [interaction]: [ButtonInteraction]) {
		const store = await getLocalStoreConfig();
		const preferences = store.getPreferences();
		preferences.privateLogSales.enabled = false;
		await store.savePreferences(preferences);

		await interaction.update((await this.buildSalesPrivateLogSection.build()) as any);
	}

	@Button("enable_sales_private_log")
	private async enablePrivateLog(@Context() [interaction]: [ButtonInteraction]) {
		const store = await getLocalStoreConfig();
		const preferences = store.getPreferences();
		preferences.privateLogSales.enabled = true;
		await store.savePreferences(preferences);

		await interaction.update((await this.buildSalesPrivateLogSection.build()) as any);
	}

	async createButton() {
		const storeEntity = await getLocalStoreConfig();

		let enableSalesPrivateLogButton: ButtonBuilder = null!;
		const preferences = storeEntity.getPreferences();
		if (preferences.privateLogSales.enabled) {
			enableSalesPrivateLogButton = new ButtonBuilder()
				.setCustomId("disable_sales_private_log")
				.setLabel("Desativar log de vendas Privado")
				.setStyle(ButtonStyle.Danger);
		} else {
			enableSalesPrivateLogButton = new ButtonBuilder()
				.setCustomId("enable_sales_private_log")
				.setLabel("Ativar log de vendas privado")
				.setStyle(ButtonStyle.Success);
		}

		return { enableSalesPrivateLogButton };
	}
}
