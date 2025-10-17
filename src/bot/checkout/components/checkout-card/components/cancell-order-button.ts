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
import { DiscordUserEntity, ProductEntity } from "@/@shared/db/entities";
import { getDiscordUserRepository, getProductRepository } from "@/@shared/db/repositories";
import { ValidateDatabaseCartItemsHelper } from "../../../helpers";
import { formatCheckoutCartItemNameHelper, getCheckoutCartItemsHelper } from "../helper";
import { SectionManagerHandler } from "../section-manager";
import { WrapperType } from "@/@shared/types";
import { RemoveFromCartUsecase } from "../usecases";

@Injectable()
export class CancelOrderButtonComponent {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => SectionManagerHandler))
		private readonly sectionManagerHandler: WrapperType<SectionManagerHandler>,
	) {}

	@Button("cancel_order")
	private async handleButtonClicked(@Context() [interaction]: [ButtonInteraction]) {
        const discordUserRepository = await getDiscordUserRepository();
        await interaction.deferReply({ flags: "Ephemeral" });

        const discordUser = await discordUserRepository.findById(interaction.user.id);
        if (!discordUser) {
            return interaction.reply({
                content: "❌ | Você não possui um carrinho ativo.",
                ephemeral: true,
            });
        }
        discordUser.cancelOrder()

        await discordUserRepository.update(discordUser);

        await interaction.editReply({
            content: "✅ | Seu pedido foi cancelado com sucesso.",
            components: [],
            embeds: [],
        });

        await interaction.channel?.delete()
    }

	async createButton() {
		const CancelCartButton = new ButtonBuilder()
			.setCustomId(`cancel_order`) // unique ID to handle clicks
			.setLabel("Cancelar compra") // text on the button
			.setStyle(ButtonStyle.Danger) // gray button, like in the image
			.setEmoji("❌");
		return { CancelCartButton };
	}
}
