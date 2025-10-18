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
import { dotEnv } from "@/@shared/lib";

import { ValidateDatabaseCartItemsHelper } from "@/bot/checkout/helpers";
import { Injectable } from "@nestjs/common";
import { DiscordUserEntity } from "@/@shared/db/entities";

export class RemoveFromCartUsecase {
	static async execute({
		discordUserId,
		productId,
		productItemId,
	}: {
		productId: string;
		productItemId: string;
		discordUserId: string;
	}): Promise<{ cartIsEmpty: boolean }> {
		const userEntity = await DiscordUserEntity.findOneBy({ id: discordUserId });
		if (!userEntity) return { cartIsEmpty: true };

		await userEntity.cart.removeFromCart({
			productId,
			productItemId,
		});

		return { cartIsEmpty: userEntity.cart.isCartEmpty() };
	}
}
