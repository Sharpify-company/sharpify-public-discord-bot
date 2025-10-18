import { dotEnv, Either, failure, success } from "@/@shared/lib";
import { AddToCartUsecase } from "./_add-to-cart.usecase";
import { ProductProps } from "@/@shared/sharpify/api";
import { Sharpify } from "@/@shared/sharpify";
import { ChannelType, InteractionResponse, PermissionsBitField } from "discord.js";
import { DiscordUserEntity } from "@/@shared/db/entities";

export async function EnsureUserExistsOnDb({
	interaction,
}: Parameters<typeof AddToCartUsecase.prototype.execute>[0]): Promise<Either<InteractionResponse, DiscordUserEntity>> {
	const member = interaction.member;
	if (!member?.user) {
		return failure(
			await interaction.reply({
				content: `Erro ao identificar usuário.`,
				flags: ["Ephemeral"],
			}),
		);
	}

	let discordUserEntity = await DiscordUserEntity.findOneBy({ id: member.user.id });
	if (!discordUserEntity) {
		discordUserEntity = DiscordUserEntity.create({
			id: member.user.id,
		});

		await discordUserEntity.save();
	}

	return success(discordUserEntity);
}
