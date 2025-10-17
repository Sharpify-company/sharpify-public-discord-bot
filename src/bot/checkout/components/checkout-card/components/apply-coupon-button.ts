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
export class ApplyCouponButtonComponent {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => SectionManagerHandler))
		private readonly sectionManagerHandler: WrapperType<SectionManagerHandler>,
	) {}

	@Modal("apply_coupon_modal")
	public async onModalSubmit(@Ctx() [interaction]: ModalContext, @ModalParam("productIdAndItemId") productIdAndItemId: string) {
		const discordUserRepository = await getDiscordUserRepository();
		const discordUser = await discordUserRepository.findById(interaction.user.id);
		if (!discordUser) {
			await interaction.reply({
				content: "Usuário não encontrado. Por favor, inicie uma compra primeiro.",
				flags: ["Ephemeral"],
			});
			return;
		}

		const couponCode = interaction.fields.getTextInputValue("couponCodeInput");

		discordUser.couponCode = couponCode;

		await discordUserRepository.update(discordUser);

		await ValidateDatabaseCartItemsHelper({ discordUserId: discordUser.id });

		interaction.deferUpdate();
		const result = await this.sectionManagerHandler.setSection({
			discordUserId: interaction.user.id,
			section: "MAIN",
		});
		await interaction.message?.edit(result as any);
	}

	@Button("apply_coupon")
	private async handleButtonClicked(@Context() [interaction]: [ButtonInteraction]) {
		const modal = new ModalBuilder().setCustomId(`apply_coupon_modal`).setTitle(`Aplicar cupom de desconto`);

		const couponCodeInput = new TextInputBuilder()
			.setCustomId("couponCodeInput")
			.setLabel(`Insira o código do cupom de desconto`)
			.setStyle(TextInputStyle.Short)
			.setMinLength(1)
			.setMaxLength(50)
			.setRequired(true);

		modal.setComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([couponCodeInput]));

		await interaction.showModal(modal);
	}

	@Button("remove_coupon")
	private async handleRemoveCouopn(@Context() [interaction]: [ButtonInteraction]) {
		const discordUserRepository = await getDiscordUserRepository();
		const discordUser = await discordUserRepository.findById(interaction.user.id);
		if (!discordUser) {
			return await interaction.reply({
				content: "Usuário não encontrado. Por favor, inicie uma compra primeiro.",
				flags: ["Ephemeral"],
			});
		}

		discordUser.couponCode = null;

		await discordUserRepository.update(discordUser);

		const result = await this.sectionManagerHandler.setSection({
			discordUserId: interaction.user.id,
			section: "MAIN",
		});
		await interaction.message?.edit(result as any);
		
		await interaction.deferUpdate();
	}

	async createButton({ discordUserId }: { discordUserId: string }) {
		const discordUserRepository = await getDiscordUserRepository();
		const discordUser = await discordUserRepository.findById(discordUserId);
		if (discordUser?.couponCode) {
			const RemoveCouponButton = new ButtonBuilder()
				.setCustomId(`remove_coupon`) // unique ID to handle clicks
				.setLabel("Remover cupom") // text on the button
				.setStyle(ButtonStyle.Danger) // gray button, like in the image
				.setEmoji("🎟️");
			return { ApplyCouponButton: RemoveCouponButton };
		}

		const ApplyCouponButton = new ButtonBuilder()
			.setCustomId(`apply_coupon`) // unique ID to handle clicks
			.setLabel("Aplicar cupom") // text on the button
			.setStyle(ButtonStyle.Primary) // gray button, like in the image
			.setEmoji("🎟️");
		return { ApplyCouponButton };
	}
}
