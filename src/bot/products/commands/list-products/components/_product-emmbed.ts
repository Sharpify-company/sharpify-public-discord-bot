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
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { BotConfig } from '@/config';
import { ProductProps } from '@/@shared/sharpify/api';
import { formatPrice } from '@/@shared/lib';
import TurndownService from 'turndown';

@Injectable()
export class ProductEmmbed {
  // 1️⃣ Modal com múltiplos inputs
  @Modal('list-products-modal')
  private handleModalSubmit(@Ctx() [interaction]: ModalContext) {
    if (!interaction.isModalSubmit()) return;

    const username = interaction.fields.getTextInputValue('username');
    const bio =
      interaction.fields.getTextInputValue('bio') || 'Nenhuma bio fornecida';

    // 3️⃣ Respondendo com embed estilizado
    const embed = new EmbedBuilder()
      .setTitle('📝 Formulário Recebido!')
      .setColor('Purple')
      .addFields(
        { name: 'Nome', value: username, inline: true },
        { name: 'Bio', value: bio, inline: false },
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed], flags: ['Ephemeral'] });
  }

  createEmbbed(product: ProductProps) {
    return new EmbedBuilder()
      .setColor(BotConfig.color)
      .setTitle(product.info.title)
      .setFields(
        {
          name: 'Preço',
          value: `*${formatPrice(product.pricing.price)}*`,
          inline: true,
        },
        {
          name: 'Estoque',
          value: `*${product.readonly.stockQuantityAvailable || 'Ilimitado'}*`,
          inline: true,
        },
        {
          name: 'ID',
          value: `*${product.id || 'N/A'}*`,
          inline: true,
        },
      )
      .setDescription(
        '```\n${}\n```'.replace(
          '${}',
          new TurndownService().turndown(
            product.info.description || 'Sem descrição',
          ),
        ),
      )
      .setImage(product.info.mainImage || '');
  }
}
