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
import { BuildConfirmDeliveryLogSection } from "./_build-confirm-delivery-section";

@Injectable()
export class EnableConfirmDeliveryLogButton {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => BuildConfirmDeliveryLogSection))
		private readonly buildConfirmDeliveryLogSection: WrapperType<BuildConfirmDeliveryLogSection>,
	) {}

	@Button("disable_confirm_delivery_log")
	private async disablePulicLog(@Context() [interaction]: [ButtonInteraction]) {
		const store = await getLocalStoreConfig();
		const preferences = store.getPreferences();
		preferences.confirmDelivery.enabled = false;
		await store.savePreferences(preferences);

		await interaction.update((await this.buildConfirmDeliveryLogSection.build()) as any);
	}

	@Button("enable_confirm_delivery_log")
	private async enablePrivateLog(@Context() [interaction]: [ButtonInteraction]) {
		const store = await getLocalStoreConfig();
		const preferences = store.getPreferences();
		preferences.confirmDelivery.enabled = true;
		await store.savePreferences(preferences);

		await interaction.update((await this.buildConfirmDeliveryLogSection.build()) as any);
	}

	async createButton() {
		const storeEntity = await getLocalStoreConfig();

		let enableConfirmDeliveryLogButton: ButtonBuilder = null!;
		const preferences = storeEntity.getPreferences();
		if (preferences.confirmDelivery.enabled) {
			enableConfirmDeliveryLogButton = new ButtonBuilder()
				.setCustomId("disable_confirm_delivery_log")
				.setLabel("Desativar log de confirmação de entrega")
				.setStyle(ButtonStyle.Danger);
		} else {
			enableConfirmDeliveryLogButton = new ButtonBuilder()
				.setCustomId("enable_confirm_delivery_log")
				.setLabel("Ativar log de confirmação de entrega")
				.setStyle(ButtonStyle.Success);
		}

		return { enableConfirmDeliveryLogButton };
	}
}
