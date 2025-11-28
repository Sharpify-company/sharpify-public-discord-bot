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
import { BuildRoleConfigure } from "./_build-role-configure";

@Injectable()
export class RemoveAllRolesComponent {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => BuildRoleConfigure))
		private readonly buildRoleConfigure: WrapperType<BuildRoleConfigure>,
	) {}

	@Button("remove_all_roles")
	private async handleButtonClicked(@Context() [interaction]: [ButtonInteraction]) {
		const store = await getLocalStoreConfig();
		await store.updateRoleSettings([]);

		await interaction.update((await this.buildRoleConfigure.build()) as any)
		// interaction.reply({
		// 	content: "Todos os cargos foram removidos com successo!",
		// 	flags: ["Ephemeral"],
		// });
	}

	async createButton() {
		const RemoveAllRolesButton = new ButtonBuilder()
			.setCustomId(`remove_all_roles`) // unique ID to handle clicks
			.setLabel("Remover todos os cargos") // text on the button
			.setStyle(ButtonStyle.Danger); // gray button, like in the image
		return { RemoveAllRolesButton };
	}
}
