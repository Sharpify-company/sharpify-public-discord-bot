import { Inject, Injectable } from "@nestjs/common";
import { Modal, Context, SlashCommand, SlashCommandContext, Ctx, ModalContext } from "necord";
import {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonStyle,
	CacheType,
	ChatInputCommandInteraction,
	Client,
	EmbedBuilder,
	Message,
	MessageCreateOptions,
	MessagePayload,
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
import { DiscordUserEntity, OrderEntity, ProductEntity } from "@/@shared/db/entities";
import { CartEmmbedComponent } from "./components/cart-emmbed";
import { SelectCartItemComponent } from "./components/select-cart-item";
import { GoBackToMainSectionButionComponent } from "./components/go-back-to-main-section-button";
import { RemoveFromCartButtonComponent } from "./components/remove-from-cart-button";
import { UpdateQuantityButtonComponent } from "./components/update-quantity-button";
import { CancelOrderButtonComponent } from "./components/cancell-order-button";
import { ApplyCouponButtonComponent } from "./components/apply-coupon-button";
import { PlaceOrderButtonComponent } from "./components/place-order-button";
import { SelectPaymentMethodComponent } from "./components/select-payment-method";
import { ViewOnWebsiteButtonComponent } from "./components/view-on-website";
import { OpenDmTutorialButtonComponent } from "./components/open-dm-tutorial-button";
import { FindEmojiHelper } from "@/@shared/helpers";

type SetSectionProps = {
	discordUserId: string;
} & (
	| {
			section: "MAIN";
	  }
	| {
			section: "CART_ITEM";
			productId: string;
			itemId: string;
	  }
	| {
			section: "CHECKOUT";
			orderEntity: OrderEntity;
	  }
);

@Injectable()
export class SectionManagerHandler {
	constructor(
		@Inject(Client) private readonly client: Client,
		private readonly cartEmmbedComponent: CartEmmbedComponent,
		private readonly selectCartItemComponent: SelectCartItemComponent,
		private readonly goBackToMainSectionButionComponent: GoBackToMainSectionButionComponent,
		private readonly removeFromCartButtonComponent: RemoveFromCartButtonComponent,
		private readonly updateQuantityButtonComponent: UpdateQuantityButtonComponent,
		private readonly cancelOrderButtonComponent: CancelOrderButtonComponent,
		private readonly applyCouponButtonComponent: ApplyCouponButtonComponent,
		private readonly placeOrderButtonComponent: PlaceOrderButtonComponent,
		private readonly selectPaymentMethodComponent: SelectPaymentMethodComponent,
		private readonly viewOnWebsiteButtonComponent: ViewOnWebsiteButtonComponent,
		private readonly openDmTutorialButtonComponent: OpenDmTutorialButtonComponent,
	) {}

	async setSection({ discordUserId, ...props }: SetSectionProps): Promise<string | MessagePayload | MessageCreateOptions> {
		if (props.section === "MAIN") {
			const { emmbed } = await this.cartEmmbedComponent.makeCartEmmbed({ discordUserId });
			const { row } = await this.selectCartItemComponent.createSelect({ discordUserId });
			const { CancelCartButton } = await this.cancelOrderButtonComponent.createButton();
			const { ApplyCouponButton } = await this.applyCouponButtonComponent.createButton({ discordUserId });
			const { selectPaymentMethod } = await this.selectPaymentMethodComponent.createSelect({ discordUserId });
			const { PlaceOrderButton } = await this.placeOrderButtonComponent.createButton({ discordUserId });

			return {
				embeds: [emmbed],
				components: [
					{ type: 1, components: [PlaceOrderButton, ApplyCouponButton, CancelCartButton] },
					selectPaymentMethod as any,
					row,
				],
				options: {
					withResponse: true,
				},
			};
		} else if (props.section === "CART_ITEM") {
			const { emmbed } = await this.cartEmmbedComponent.makeSingleCartItemEmmbed({
				discordUserId,
				productId: props.productId,
				itemId: props.itemId,
			});
			const { row } = await this.selectCartItemComponent.createSelect({ discordUserId, defaultItemId: props.itemId });
			const { backToSummaryButton } = await this.goBackToMainSectionButionComponent.createButton();
			const { removeFromCartButton } = await this.removeFromCartButtonComponent.createButton({
				productId: props.productId,
				productItemId: props.itemId,
			});
			const { UpdateQuantityCartButton } = await this.updateQuantityButtonComponent.createButton({
				productId: props.productId,
				productItemId: props.itemId,
			});

			return {
				embeds: [emmbed],
				components: [
					{ type: 1, components: [UpdateQuantityCartButton, removeFromCartButton] },
					row,
					{ type: 1, components: [backToSummaryButton] },
				],
				options: {
					withResponse: true,
				},
			};
		}

		const steps = new EmbedBuilder().setColor(BotConfig.color).setTitle(`Passos para finalizar o pedido`).setDescription(`
			\`\`\`
✅ 1. Lembre-se de abrir a sua DM antes de pagar.
--------------------------
✅ 2. Realize o pagamento via Pix utilizando o código copia e cola ou o QR Code abaixo.
--------------------------
✅ 3. Após o pagamento, seu pedido será processado automaticamente.
--------------------------
✅ 4. Assim que o pagamento for confirmado, você receberá seus produtos aqui na sua DM.
			\`\`\`
				`);

		const { emmbed } = await this.cartEmmbedComponent.makeCartEmmbed({
			discordUserId,
		});
		const { CancelCartButton } = await this.cancelOrderButtonComponent.createButton();
		const { ViewOnWebsiteButton } = await this.viewOnWebsiteButtonComponent.createButton({
			orderId: props.orderEntity.id,
		});
		const { OpenDmTutorialButton } = await this.openDmTutorialButtonComponent.createButton();

		if (props.orderEntity.orderProps.payment.gateway.data.hasQrCode) {
			const qrCode = props.orderEntity.orderProps.payment.gateway.data.qrCode;

			const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");
			const attachment = new AttachmentBuilder(Buffer.from(base64Data, "base64"), { name: "qrcode.png" });
			const qrUrl = `attachment://qrcode.png`;

			const Pixemmbed = new EmbedBuilder()
				.setColor(BotConfig.color)
				.setTitle(`Pagamento via Pix`)
				.setDescription(`Para pagar via Pix, utilize o código abaixo no seu aplicativo bancário:`)
				.addFields({
					name: "🔑 **Código copia e cola**",
					value: `\`\`\`${props.orderEntity.orderProps.payment.gateway.data.code}\`\`\``,
				})
				.setImage(qrUrl);

			return {
				embeds: [steps, Pixemmbed],
				components: [{ type: 1, components: [ViewOnWebsiteButton, OpenDmTutorialButton, CancelCartButton] }],
				files: [attachment],
			};
		}

		const cartEmoji = await FindEmojiHelper({ client: this.client, name: "Sharpify_carrinho" });

		const PayButton = new ButtonBuilder()
			.setLabel("Pagar agora")
			.setStyle(ButtonStyle.Link)
			.setURL(props.orderEntity.orderProps.payment.gateway.data.paymentLink)
			.setEmoji({ id: cartEmoji?.id });
		const ExternalLinkEmmbed = new EmbedBuilder()
			.setColor(BotConfig.color)
			.setTitle(`Pagamento via pagamento externo`)
			.setDescription(`Accesse o link externo para pagar:`);

		return {
			embeds: [steps, ExternalLinkEmmbed],
			components: [{ type: 1, components: [ViewOnWebsiteButton, PayButton, OpenDmTutorialButton, CancelCartButton] }],
			files: [],
		};
	}
}
