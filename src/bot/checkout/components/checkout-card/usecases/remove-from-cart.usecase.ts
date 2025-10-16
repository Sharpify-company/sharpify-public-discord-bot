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
import { getDiscordUserRepository } from "@/@shared/db/repositories";

import { ValidateDatabaseCartItemsHelper } from "@/bot/checkout/helpers";
import { Injectable } from "@nestjs/common";

export class RemoveFromCartUsecase {
	static async execute({
		discordUserId,
		productId,
		productItemId,
	}: {
		productId: string;
		productItemId: string;
		discordUserId: string;
	}) {
		const discordUserRepository = await getDiscordUserRepository();

		const userEntity = await discordUserRepository.findById(discordUserId);
		if (!userEntity) return;

		userEntity.removeFromCart({
			productId,
			productItemId,
		});
		await discordUserRepository.update(userEntity);
	}
}
