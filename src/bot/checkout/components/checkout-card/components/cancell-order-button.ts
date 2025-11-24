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
	TextChannel,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { BotConfig } from "@/config";
import { ProductProps } from "@/@shared/sharpify/api";
import { formatPrice } from "@/@shared/lib";
import TurndownService from "turndown";
import { DiscordUserEntity, EmojiEntity, ProductEntity } from "@/@shared/db/entities";
import { ValidateDatabaseCartItemsHelper } from "../../../helpers";
import { formatCheckoutCartItemNameHelper, getCheckoutCartItemsHelper } from "../helper";
import { SectionManagerHandler } from "../section-manager";
import { WrapperType } from "@/@shared/types";
import { HandleOrderCancelledUsecase, RemoveFromCartUsecase } from "../usecases";
import { HandleDiscordMemberNotFound } from "@/@shared/handlers";
import { FindEmojiHelper } from "@/@shared/helpers";

@Injectable()
export class CancelOrderButtonComponent {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => SectionManagerHandler))
		private readonly sectionManagerHandler: WrapperType<SectionManagerHandler>,
		private readonly HandleOrderCancelledUsecase: HandleOrderCancelledUsecase,
	) {}

	@Button("cancel_order")
	private async handleButtonClicked(@Context() [interaction]: [ButtonInteraction]) {
		await interaction.deferReply({ flags: "Ephemeral" });

		const discordUser = await DiscordUserEntity.findOneBy({ id: interaction.user.id });
		if (!discordUser) return await HandleDiscordMemberNotFound({ interaction });
		
		await interaction.editReply({
			content: "✅ | Seu pedido foi cancelado com sucesso.",
			components: [],
			embeds: [],
		});
		await this.HandleOrderCancelledUsecase.execute({ discordUserId: discordUser.id });


	}

	async createButton() {
		const cancelEmoji = await FindEmojiHelper({ client: this.client, name: "Sharpify_recusar" });

		const CancelCartButton = new ButtonBuilder()
			.setCustomId(`cancel_order`)
			.setLabel("Cancelar compra")
			.setStyle(ButtonStyle.Secondary);
		cancelEmoji && CancelCartButton.setEmoji({ id: cancelEmoji.id });
		return { CancelCartButton };
	}
}
