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
import { DiscordUserEntity, ProductEntity } from "@/@shared/db/entities";
import { ValidateDatabaseCartItemsHelper } from "../../../helpers";
import { formatCheckoutCartItemNameHelper, getCheckoutCartItemsHelper } from "../helper";
import { SectionManagerHandler } from "../section-manager";
import { WrapperType } from "@/@shared/types";
import { RemoveFromCartUsecase } from "../usecases";

@Injectable()
export class RemoveFromCartButtonComponent {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => SectionManagerHandler))
		private readonly sectionManagerHandler: WrapperType<SectionManagerHandler>,
	) {}

	@Button("remove_from_cart:productIdAndItemId")
	private async handleButtonClicked(
		@Context() [interaction]: [ButtonInteraction],
		@ComponentParam("productIdAndItemId") productIdAndItemId: string,
	) {
		const [productId, productItemId] = productIdAndItemId.split(":");

		const { cartIsEmpty } = await RemoveFromCartUsecase.execute({
			discordUserId: interaction.user.id,
			productId,
			productItemId,
		});

		await interaction.deferUpdate();
		if (cartIsEmpty) return interaction.channel?.delete();

		const result = await this.sectionManagerHandler.setSection({
			discordUserId: interaction.user.id,
			section: "MAIN",
		});
		await interaction.message.edit(result as any);
	}

	async createButton({ productId, productItemId }: { productId: string; productItemId: string }) {
		const removeFromCartButton = new ButtonBuilder()
			.setCustomId(`remove_from_cart${productId}:${productItemId}`) // unique ID to handle clicks
			.setLabel("Remover do carrinho") // text on the button
			.setStyle(ButtonStyle.Danger) // gray button, like in the image
			.setEmoji("🗑️");
		return { removeFromCartButton };
	}
}
