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
import { BuildPreferenceConfigure } from "../_build-preference-configure";

@Injectable()
export class FailLogButtonComponent {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => BuildPreferenceConfigure))
		private readonly buildPreferenceConfigure: WrapperType<BuildPreferenceConfigure>,
	) {}

	@Button("go_to_fail_log_settings")
	private async log(@Context() [interaction]: [ButtonInteraction]) {
		const store = await getLocalStoreConfig();

		await interaction.update((await this.buildPreferenceConfigure.build({ section: "FAIL_LOG" })) as any);
	}

	async createButton() {
		const failLogButton = new ButtonBuilder()
			.setCustomId("go_to_fail_log_settings")
			.setLabel("Configurar log de falhas")
			.setStyle(ButtonStyle.Secondary);
		return { failLogButton };
	}
}
