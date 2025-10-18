import { Sharpify } from "@/@shared/sharpify";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	CacheType,
	ChannelType,
	EmbedBuilder,
	PermissionsBitField,
} from "discord.js";
import { ValidateProduct } from "./validate-product";
import { dotEnv } from "@/@shared/lib";
import { EnsureCartChannelCreated } from "./ensure-cart-channel-created";
import { EnsureUserExistsOnDb } from "./ensure-user-exists-on-db";
import { CheckoutCardComponent } from "../../../checkout-card/checkout-card";
import { CreateReplyToGoToCheckout } from "./create-reply-to-go-to-checkout";
import { ValidateDatabaseCartItemsHelper } from "@/bot/checkout/helpers";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AddToCartUsecase {
	constructor(private readonly checkoutCardComponent: CheckoutCardComponent) {}

	async execute(input: { interaction: ButtonInteraction<CacheType>; productId: string; productItemId: string }) {
		const { interaction } = input;

		const validateProductResult = await ValidateProduct(input);
		if (validateProductResult.isFailure()) return;

		const product = validateProductResult.value;

		const ensureUserCreatedResult = await EnsureUserExistsOnDb(input);
		if (ensureUserCreatedResult.isFailure()) return;

		const user = ensureUserCreatedResult.value;

		user.cart.addToCart({
			productId: product.id,
			productItemId: input.productItemId,
			quantity: 1,
		});
		await user.save();

		const ensureCartResult = await EnsureCartChannelCreated({
			...input,
			user,
		});
		if (ensureCartResult.isFailure()) return;

		const { channel, same: sameChannel } = ensureCartResult.value;

		await CreateReplyToGoToCheckout({
			...input,
			channel,
		});

		if (!sameChannel) {
			const checkoutReply = await this.checkoutCardComponent.sendCheckoutCardToChannel({
				channel,
				discordUser: user,
			});
			user.cart.messageId = checkoutReply.id;
		} else {
			await this.checkoutCardComponent.editCheckoutCardToChannel({
				channel,
				discordUser: user,
				messageId: user.cart.messageId!,
			});
		}

		user.cart.channelId = channel.id;
		await user.save();

		await ValidateDatabaseCartItemsHelper({ discordUserId: user.id });
	}
}
