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
export class ProductCardComponent {
  createProductCard(product: ProductProps) {
    return new EmbedBuilder()
      .setColor(BotConfig.color)
      .setTitle('Sistema de compra')
      .setDescription(
        new TurndownService().turndown(product.info.description || ''),
      )
      .addFields(
        { name: '🌐 Produto', value: `\`\`\`${product.info.title}\`\`\`` },
        {
          name: '💵 Valor',
          value: `\`\`\`${formatPrice(product.pricing.price)}\`\`\``,
          inline: true,
        },
        {
          name: '📦 Estoque disponível pra compra',
          value:
            product.readonly.stockQuantityAvailable === null
              ? `\`\`\`∞ Ilimitado\`\`\``
              : `\`\`\`${product.readonly.stockQuantityAvailable} Unidades\`\`\``,
          inline: true,
        },
      )
      .setImage(product.info.mainImage || '');
  }
}
