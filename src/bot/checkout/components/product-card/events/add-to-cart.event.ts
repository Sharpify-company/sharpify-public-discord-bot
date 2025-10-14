import { Injectable } from '@nestjs/common';
import {
  Modal,
  Context,
  SlashCommand,
  SlashCommandContext,
  Ctx,
  ModalContext,
  Button,
  ComponentParam,
  StringSelect,
  StringSelectContext,
  SelectedStrings,
} from 'necord';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
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
export class AddToCartEvent {
  @Button('add_to_cart_:productIdAndItemId')
  private async handleButtonClicked(
    @Context() [interaction]: [ButtonInteraction],
    @ComponentParam('productIdAndItemId') productIdAndItemId: string,
  ) {
    const [productId, productItemId] = productIdAndItemId.split(':');
    console.log(
      '🚀 ~ AddToCartEvent ~ handleChannelSelected ~ productId:',
      productId,
      productItemId,
    );
  }
  @StringSelect('add_to_cart_:productId')
  private async handleDyamic(
    @Context() [interaction]: [StringSelectContext],
    @ComponentParam('productId') productId: string,
    @SelectedStrings() selected: string[],
  ) {
    const [productItemId] = selected;
    console.log(
      '🚀 ~ AddToCartEvent ~ handleChannelSelected ~ productId 2:',
      productId,
      productItemId,
    );
  }
}
