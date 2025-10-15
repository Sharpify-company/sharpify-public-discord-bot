import { Injectable } from '@nestjs/common';
import {
  Modal,
  Context,
  SlashCommand,
  SlashCommandContext,
  Ctx,
  ModalContext,
} from 'necord';
import {
  ActionRowBuilder,
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Message,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { BotConfig } from '@/config';
import { ProductProps } from '@/@shared/sharpify/api';
import { formatPrice } from '@/@shared/lib';
import TurndownService from 'turndown';
import { DiscordUserEntity } from '@/@shared/db/entities';

@Injectable()
export class CheckoutCardComponent {
  static async sendCheckoutCardToChannel({
    channel,
    discordUser,
  }: {
    discordUser: DiscordUserEntity;
    channel: TextChannel;
  }): Promise<Message<true>> {
    const emmbed = new EmbedBuilder()
      .setColor(BotConfig.color)
      .setTitle('Compra');

    return channel.send({
      embeds: [emmbed],
      components: [],
      options: {
        withResponse: true,
      },
    });
  }
}
