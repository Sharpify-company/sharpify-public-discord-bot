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
import { dotEnv, formatPrice } from "@/@shared/lib";
import TurndownService from "turndown";
import { DiscordUserEntity, OrderEntity, ProductEntity } from "@/@shared/db/entities";
import { ValidateDatabaseCartItemsHelper } from "../../../helpers";
import { formatCheckoutCartItemNameHelper, getCheckoutCartItemsHelper } from "../helper";
import { SectionManagerHandler } from "../section-manager";
import { WrapperType } from "@/@shared/types";
import { HandleOrderApprovedUsecase, RemoveFromCartUsecase } from "../usecases";
import { Sharpify } from "@/@shared/sharpify";
import { HandleDiscordMemberNotFound } from "@/@shared/handlers";

function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

@Injectable()
export class PlaceOrderButtonComponent {
	constructor(
		@Inject(Client) private readonly client: Client,
		private readonly handleOrderApprovedUsecase: HandleOrderApprovedUsecase,
		@Inject(forwardRef(() => SectionManagerHandler))
		private readonly sectionManagerHandler: WrapperType<SectionManagerHandler>,
	) {}

	@Modal("place_order_modal")
	public async onModalSubmit(@Ctx() [interaction]: ModalContext) {
		const discordUser = await DiscordUserEntity.findOneBy({ id: interaction.user.id });
		if (!discordUser) return await HandleDiscordMemberNotFound({ interaction });

		const firstName = interaction.fields.getTextInputValue("firstNameInput");
		const lastName = interaction.fields.getTextInputValue("lastNameInput");
		const email = interaction.fields.getTextInputValue("emailInput");
		if (!isValidEmail(email)) {
			await interaction.reply({
				content: "Por favor, insira um email válido.",
				flags: ["Ephemeral"],
			});
			return;
		}

		await discordUser.personalInfo.updateInfo({
			firstName,
			lastName,
			email,
		});

		interaction.deferUpdate();

		const placeOrderResult = await Sharpify.api.v1.checkout.order.placeOrder({
			storeId: dotEnv.STORE_ID,
			affiliateCode: null,
			couponCode: discordUser.cart.couponCode || null,
			payment: {
				gatewayMethod: discordUser.cart.gatewayMethod || "PIX",
			},
			customer: {
				firstName: discordUser.personalInfo.firstName!,
				lastName: discordUser.personalInfo.lastName!,
				email: discordUser.personalInfo.email!,
			},
			products: discordUser.cart.cartItems.map((item) => ({
				productId: item.productId,
				productItemId: item.productItemId,
				quantity: item.quantity,
			})),
		});
		if (!placeOrderResult.success) {
			await interaction.reply({
				content: `❌ Não foi possível processar seu pedido: ${placeOrderResult.errorName}`,
				flags: ["Ephemeral"],
			});
			return;
		}

		const orderEntity = OrderEntity.createOrder({
			id: placeOrderResult.data.orderId,
			customerId: discordUser.id,
			deliveryStatus: "PENDING",
			orderProps: placeOrderResult.data.order,
		});
		await orderEntity.save();

		if (placeOrderResult.data.isApproved) {
			interaction.deferUpdate();
			return await this.handleOrderApprovedUsecase.execute({
				orderId: orderEntity.id,
			});
		}

		const result = await this.sectionManagerHandler.setSection({
			discordUserId: interaction.user.id,
			section: "CHECKOUT",
			orderEntity,
		});
		await interaction.message?.edit(result as any);
	}

	@Button("place_order")
	private async handleButtonClicked(@Context() [interaction]: [ButtonInteraction]) {
		const discordUser = await DiscordUserEntity.findOneBy({ id: interaction.user.id });
		if (!discordUser) return await HandleDiscordMemberNotFound({ interaction });

		const modal = new ModalBuilder().setCustomId(`place_order_modal`).setTitle(`Informações do pagador`);

		const firstNameInput = new TextInputBuilder()
			.setCustomId("firstNameInput")
			.setLabel(`Nome`)
			.setValue(discordUser.personalInfo.firstName ?? "")
			.setStyle(TextInputStyle.Short)
			.setMinLength(1)
			.setMaxLength(40)
			.setRequired(true);

		const lastNameInput = new TextInputBuilder()
			.setCustomId("lastNameInput")
			.setLabel(`Ultimo nome`)
			.setValue(discordUser.personalInfo.lastName ?? "")
			.setStyle(TextInputStyle.Short)
			.setMinLength(1)
			.setMaxLength(40)
			.setRequired(true);

		const emailInput = new TextInputBuilder()
			.setCustomId("emailInput")
			.setLabel(`Email`)
			.setValue(discordUser.personalInfo.email ?? "")
			.setStyle(TextInputStyle.Short)
			.setMinLength(1)
			.setMaxLength(150)
			.setRequired(true);

		modal.setComponents(
			new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([firstNameInput]),
			new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([lastNameInput]),
			new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([emailInput]),
		);

		await interaction.showModal(modal);
	}

	async createButton({ discordUserId }: { discordUserId: string }) {
		const discordUser = await DiscordUserEntity.findOneBy({ id: discordUserId });

		const PlaceOrderButton = new ButtonBuilder()
			.setCustomId(`place_order`) // unique ID to handle clicks
			.setLabel("Finalizar compra") // text on the button
			.setStyle(ButtonStyle.Success) // gray button, like in the image
			.setEmoji("☑️")
			.setDisabled(!discordUser || !discordUser.cart.gatewayMethod);
		return { PlaceOrderButton };
	}
}
