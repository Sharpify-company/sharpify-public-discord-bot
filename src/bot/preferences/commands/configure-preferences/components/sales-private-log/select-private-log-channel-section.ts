import { forwardRef, Inject, Injectable } from "@nestjs/common";
import {
	Modal,
	Context,
	SlashCommand,
	SlashCommandContext,
	Ctx,
	StringSelect,
	StringSelectContext,
	SelectedStrings,
	SelectedChannels,
	ChannelSelect,
	ISelectedChannels,
	ComponentParam,
} from "necord";
import {
	ActionRowBuilder,
	CacheType,
	ChannelSelectMenuBuilder,
	ChannelType,
	ChatInputCommandInteraction,
	Client,
	EmbedBuilder,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	ModalSubmitInteraction,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
	TextChannel,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { BotConfig } from "@/config";
import { ProductProps } from "@/@shared/sharpify/api";
import { formatPrice } from "@/@shared/lib";
import TurndownService from "turndown";
import { ProductCardComponent } from "@/bot/checkout/components";
import { getLocalStoreConfig, Sharpify } from "@/@shared/sharpify";
import { OrderEntity, ProductEntity } from "@/@shared/db/entities";
import { BuildPreferenceConfigure } from "../_build-preference-configure";
import { WrapperType } from "@/@shared/types";

@Injectable()
export class SelectSalesPrivateLogChannel {
	constructor(
		@Inject(forwardRef(() => BuildPreferenceConfigure))
		private readonly buildPreferenceConfigure: WrapperType<BuildPreferenceConfigure>,
		@Inject(Client) private readonly client: Client,
	) {}

	@ChannelSelect("select_sales_private_log_channel")
	private async handleChannelSelected(
		@Context() [interaction]: StringSelectContext,
		@SelectedChannels() selected: ISelectedChannels,
	) {
		const channel = interaction.guild?.channels.cache.get(selected?.at(0)!.id);

		if (!channel?.isTextBased()) {
			return interaction.reply({
				content: "O canal selecionado não é um canal de texto válido.",
				flags: ["Ephemeral"],
			});
		}

		const store = await getLocalStoreConfig();
		const preferences = store.getPreferences();
		preferences.privateLogSales.channelId = channel.id;
		await store.savePreferences(preferences);

		await interaction.update((await this.buildPreferenceConfigure.build({ section: "PRIVATE_LOG" })) as any);
	}

	async createSelectChannel() {
		const store = await getLocalStoreConfig();
		const preferences = store.getPreferences();

		const selectMenu = new ChannelSelectMenuBuilder()
			.setCustomId(`select_sales_private_log_channel`)
			.setPlaceholder("Selecione qual canal o log privado vai ser mandado...")
			.setMaxValues(1)
			.setMinValues(1);

		const defaultPlaceholder = "Selecione qual canal o log privado vai ser mandado...";
		if (preferences.privateLogSales.channelId) {
			const channel = (await this.client.channels
				.fetch(preferences.privateLogSales.channelId)
				.catch(() => null)) as TextChannel;
			if (channel) {
				selectMenu.setPlaceholder(`✅ Canal selecionado: #${channel.name}`);
			} else selectMenu.setPlaceholder(defaultPlaceholder);
		} else {
			selectMenu.setPlaceholder(defaultPlaceholder);
		}

		return new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(selectMenu);
	}
}
