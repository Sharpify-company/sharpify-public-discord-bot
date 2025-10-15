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
import { Sharpify } from '@/@shared/sharpify';
import { AddToCartUsecase } from '../usecases';

@Injectable()
export class AddToCartEvent {
  @Button('add_to_cart_:productIdAndItemId')
  private async handleButtonClicked(
    @Context() [interaction]: [ButtonInteraction],
    @ComponentParam('productIdAndItemId') productIdAndItemId: string,
  ) {
    const [productId, productItemId] = productIdAndItemId.split(':');
    await this.addToCart({ interaction, productId, productItemId });
  }
  @StringSelect('add_to_cart_:productId')
  private async handleDyamic(
    @Context() [interaction]: [StringSelectContext],
    @ComponentParam('productId') productId: string,
    @SelectedStrings() selected: string[],
  ) {
    const [productItemId] = selected;

    await this.addToCart({
      interaction: interaction as any,
      productId,
      productItemId,
    });
  }

  private async addToCart({
    interaction,
    productId,
    productItemId,
  }: {
    interaction: ButtonInteraction<CacheType>;
    productId: string;
    productItemId: string;
  }) {
    await AddToCartUsecase.execute({ interaction, productId, productItemId });
  }
}
