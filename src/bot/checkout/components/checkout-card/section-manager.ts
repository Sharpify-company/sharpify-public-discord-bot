import { Inject, Injectable } from "@nestjs/common";
import { Modal, Context, SlashCommand, SlashCommandContext, Ctx, ModalContext } from "necord";
import {
	ActionRowBuilder,
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
import { DiscordUserEntity, ProductEntity } from "@/@shared/db/entities";
import { CartEmmbedComponent } from "./components/cart-emmbed";
import { SelectCartItemComponent } from "./components/select-cart-item";
import { GoBackToMainSectionButionComponent } from "./components/go-back-to-main-section-button";
import { RemoveFromCartButtonComponent } from "./components/remove-from-cart-button";
import { getDiscordUserRepository } from "@/@shared/db/repositories";
import { UpdateQuantityButtonComponent } from "./components/update-quantity-button";
import { CancelOrderButtonComponent } from "./components/cancell-order-button";
import { ApplyCouponButtonComponent } from "./components/apply-coupon-button";
import { PlaceOrderButtonComponent } from "./components/place-order-button";

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
		private readonly placeOrderButtonComponent: PlaceOrderButtonComponent
	) {}

	async setSection({ discordUserId, ...props }: SetSectionProps): Promise<string | MessagePayload | MessageCreateOptions> {
		if (props.section === "MAIN") {
			const { emmbed } = await this.cartEmmbedComponent.makeCartEmmbed({ discordUserId });
			const { row } = await this.selectCartItemComponent.createSelect({ discordUserId });
			const { CancelCartButton } = await this.cancelOrderButtonComponent.createButton();
			const { ApplyCouponButton } = await this.applyCouponButtonComponent.createButton({ discordUserId });
			const { PlaceOrderButton } = await this.placeOrderButtonComponent.createButton();

			return {
				embeds: [emmbed],
				components: [{ type: 1, components: [PlaceOrderButton, ApplyCouponButton, CancelCartButton] }, row],
				options: {
					withResponse: true,
				},
			};
		}

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
}
