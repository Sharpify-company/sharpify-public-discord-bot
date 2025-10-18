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

@Injectable()
export class UpdateQuantityButtonComponent {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => SectionManagerHandler))
		private readonly sectionManagerHandler: WrapperType<SectionManagerHandler>,
	) {}

	@Modal("update_cart_quantity_modal/:productIdAndItemId")
	public async onModalSubmit(@Ctx() [interaction]: ModalContext, @ModalParam("productIdAndItemId") productIdAndItemId: string) {
		const discordUser = await DiscordUserEntity.findOneBy({ id: interaction.user.id });
		if (!discordUser) {
			await interaction.reply({
				content: "Usuário não encontrado. Por favor, inicie uma compra primeiro.",
				flags: ["Ephemeral"],
			});
			return;
		}

		const quantity = parseInt(interaction.fields.getTextInputValue("quantityInput"));
		if (isNaN(quantity) || quantity < 1) {
			await interaction.reply({
				content: "Quantidade inválida. Por favor, insira um número válido maior que 0.",
				flags: ["Ephemeral"],
			});
			return;
		}

		const [productId, productItemId] = productIdAndItemId.split(":");

		const productItems = await getCheckoutCartItemsHelper({ discordUserId: interaction.user.id });
		const cartItem = productItems.find((v) => v.product.id === productId && v.item.id === productItemId);
		if (!cartItem) {
			await interaction.reply({
				content: "Item não encontrado no carrinho.",
				flags: ["Ephemeral"],
			});
			return;
		}

		if (cartItem.item.inventory.stockQuantity !== null && quantity > cartItem.item.inventory.stockQuantity) {
			await interaction.reply({
				content: `Quantidade inválida. A quantidade máxima disponível em estoque é ${cartItem.item.inventory.stockQuantity}.`,
				flags: ["Ephemeral"],
			});
			return;
		}

		discordUser.cart.cartItems = discordUser.cart.cartItems.map((v) => {
			if (v.productId === productId && v.productItemId === productItemId) {
				v.quantity = quantity;
			}
			return v;
		});
		await discordUser.save();

		interaction.deferUpdate();
		const result = await this.sectionManagerHandler.setSection({
			discordUserId: interaction.user.id,
			section: "CART_ITEM",
			productId,
			itemId: productItemId,
		});
		await interaction.message?.edit(result as any);
	}

	@Button("update_quantity/:productIdAndItemId")
	private async handleButtonClicked(
		@Context() [interaction]: [ButtonInteraction],
		@ComponentParam("productIdAndItemId") productIdAndItemId: string,
	) {
		const [productId, productItemId] = productIdAndItemId.split(":");

		const productItems = await getCheckoutCartItemsHelper({ discordUserId: interaction.user.id });
		const cartItem = productItems.find((v) => v.product.id === productId && v.item.id === productItemId);
		if (!cartItem) {
			await interaction.reply({
				content: "Item não encontrado no carrinho.",
				flags: ["Ephemeral"],
			});
			return;
		}

		const modal = new ModalBuilder()
			.setCustomId(`update_cart_quantity_modal/${productId}:${productItemId}`)
			.setTitle(`Editar quantidade - ${formatCheckoutCartItemNameHelper(cartItem)}`);

		const quantityInput = new TextInputBuilder()
			.setCustomId("quantityInput")
			.setLabel(
				`Insira a nova quantidade. MAX ${cartItem.item.inventory.stockQuantity === null ? "Ilimitado" : cartItem.item.inventory.stockQuantity + " unidades"}`,
			)
			.setValue(String(cartItem.quantity))
			.setStyle(TextInputStyle.Short)
			.setMinLength(1)
			.setMaxLength(3)
			.setRequired(true);

		modal.setComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([quantityInput]));

		await interaction.showModal(modal);
	}

	async createButton({ productId, productItemId }: { productId: string; productItemId: string }) {
		const UpdateQuantityCartButton = new ButtonBuilder()
			.setCustomId(`update_quantity/${productId}:${productItemId}`) // unique ID to handle clicks
			.setLabel("Editar quantidade") // text on the button
			.setStyle(ButtonStyle.Success) // gray button, like in the image
			.setEmoji("📦");
		return { UpdateQuantityCartButton };
	}
}
