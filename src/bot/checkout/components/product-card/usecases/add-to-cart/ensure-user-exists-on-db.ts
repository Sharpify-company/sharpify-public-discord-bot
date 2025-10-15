import { dotEnv, Either, failure, success } from '@/@shared/lib';
import { AddToCartUsecase } from './_add-to-cart.usecase';
import { ProductProps } from '@/@shared/sharpify/api';
import { Sharpify } from '@/@shared/sharpify';
import {
  ChannelType,
  InteractionResponse,
  PermissionsBitField,
} from 'discord.js';
import { DiscordUserEntity } from '@/@shared/db/entities';
import { getDiscordUserRepository } from '@/@shared/db/repositories';

export async function EnsureUserExistsOnDb({
  interaction,
}: Parameters<typeof AddToCartUsecase.execute>[0]): Promise<
  Either<InteractionResponse, DiscordUserEntity>
> {
  const member = interaction.member;
  if (!member?.user) {
    return failure(
      await interaction.reply({
        content: `Erro ao identificar usuário.`,
        flags: ['Ephemeral'],
      }),
    );
  }

  const discordUserRepository = await getDiscordUserRepository();

  let discordUserEntity = await discordUserRepository.findById(member.user.id);
  if (!discordUserEntity) {
    discordUserEntity = new DiscordUserEntity({
      id: member.user.id,
    });

    await discordUserRepository.create(discordUserEntity);
  }

  return success(discordUserEntity);
}
