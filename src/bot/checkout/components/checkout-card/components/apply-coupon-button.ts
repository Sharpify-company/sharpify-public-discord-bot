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
import { ValidateDatabaseCartItemsHelper } from "../../../helpers";
import { formatCheckoutCartItemNameHelper, getCheckoutCartItemsHelper } from "../helper";
import { SectionManagerHandler } from "../section-manager";
import { WrapperType } from "@/@shared/types";
import { RemoveFromCartUsecase } from "../usecases";
import { HandleDiscordMemberNotFound } from "@/@shared/handlers";

@Injectable()
export class ApplyCouponButtonComponent {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => SectionManagerHandler))
		private readonly sectionManagerHandler: WrapperType<SectionManagerHandler>,
	) {}

	@Modal("apply_coupon_modal")
	public async onModalSubmit(@Ctx() [interaction]: ModalContext, @ModalParam("productIdAndItemId") productIdAndItemId: string) {
		const discordUser = await DiscordUserEntity.findOneBy({ id: interaction.user.id });
		if (!discordUser) return await HandleDiscordMemberNotFound({ interaction });

		const couponCode = interaction.fields.getTextInputValue("couponCodeInput");

		discordUser.cart.couponCode = couponCode;

		await discordUser.save();

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
		const discordUser = await DiscordUserEntity.findOneBy({ id: interaction.user.id });
		if (!discordUser) return await HandleDiscordMemberNotFound({ interaction });

		discordUser.cart.couponCode = null;

		await discordUser.save();

		const result = await this.sectionManagerHandler.setSection({
			discordUserId: interaction.user.id,
			section: "MAIN",
		});
		await interaction.message?.edit(result as any);

		await interaction.deferUpdate();
	}

	async createButton({ discordUserId }: { discordUserId: string }) {
		const discordUser = await DiscordUserEntity.findOneBy({ id: discordUserId });
		if (discordUser?.cart.couponCode) {
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
