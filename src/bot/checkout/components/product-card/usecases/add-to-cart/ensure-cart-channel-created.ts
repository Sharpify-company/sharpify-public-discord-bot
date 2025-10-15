import { dotEnv, Either, failure, success } from '@/@shared/lib';
import { AddToCartUsecase } from './_add-to-cart.usecase';
import { ProductProps } from '@/@shared/sharpify/api';
import { Sharpify } from '@/@shared/sharpify';
import {
  ChannelType,
  InteractionResponse,
  PermissionsBitField,
  TextChannel,
} from 'discord.js';
import { DiscordUserEntity } from '@/@shared/db/entities';
import { getDiscordUserRepository } from '@/@shared/db/repositories';

export async function EnsureCartChannelCreated({
  interaction,
  user,
}: Parameters<typeof AddToCartUsecase.execute>[0] & {
  user: DiscordUserEntity;
}): Promise<Either<InteractionResponse, { channel: TextChannel }>> {
  const member = interaction.member;
  if (!member?.user) {
    return failure(
      await interaction.reply({
        content: `Erro ao identificar usuário.`,
        flags: ['Ephemeral'],
      }),
    );
  }

  const guild = interaction.guild;
  if (!guild) {
    return failure(
      await interaction.reply({
        content: `Erro ao identificar servidor.`,
        flags: ['Ephemeral'],
      }),
    );
  }

  const channelParrent = await interaction.client.channels.cache.get(
    dotEnv.CHECKOUT_CATEGORY_ID,
  );
  if (!channelParrent) {
    return failure(
      await interaction.reply({
        content: `Erro ao identificar a categoria do servidor.`,
        flags: ['Ephemeral'],
      }),
    );
  }

  if (channelParrent.type !== ChannelType.GuildCategory) {
    return failure(
      await interaction.reply({
        content: `Erro ao identificar a categoria do servidor: Categoria inválida.`,
        flags: ['Ephemeral'],
      }),
    );
  }

  if (user.cartChannelId) {
    const existingChannel = guild.channels.cache.get(user.cartChannelId);
    if (existingChannel)
      return success({ channel: existingChannel as TextChannel });
  }

  // Create the channel
  const textChannel = await guild.channels.create({
    name: `🛒   ---   ${member.user.username}`,
    type: ChannelType.GuildText,
    parent: channelParrent,
    permissionOverwrites: [
      {
        id: guild.id, // everyone
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: member.user.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.ReadMessageHistory,
        ],
      },
    ],
  });

  return success({ channel: textChannel });
}
