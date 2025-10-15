import { Sharpify } from '@/@shared/sharpify';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  ChannelType,
  EmbedBuilder,
  PermissionsBitField,
} from 'discord.js';
import { ValidateProduct } from './validate-product';
import { dotEnv } from '@/@shared/lib';
import { EnsureCartChannelCreated } from './ensure-cart-channel-created';
import { EnsureUserExistsOnDb } from './ensure-user-exists-on-db';
import { getDiscordUserRepository } from '@/@shared/db/repositories';
import { CheckoutCardComponent } from '../../../checkout-card/checkout-card';
import { CreateReplyToGoToCheckout } from './create-reply-to-go-to-checkout';

export class AddToCartUsecase {
  static async execute(input: {
    interaction: ButtonInteraction<CacheType>;
    productId: string;
    productItemId: string;
  }) {
    const discordUserRepository = await getDiscordUserRepository();

    const { interaction } = input;

    const validateProductResult = await ValidateProduct(input);
    if (validateProductResult.isFailure()) return;

    const product = validateProductResult.value;

    const ensureUserCreatedResult = await EnsureUserExistsOnDb(input);
    if (ensureUserCreatedResult.isFailure()) return;

    const user = ensureUserCreatedResult.value;

    const ensureCartResult = await EnsureCartChannelCreated({
      ...input,
      user,
    });
    if (ensureCartResult.isFailure()) return;

    const { channel } = ensureCartResult.value;

    await CreateReplyToGoToCheckout({
      ...input,
      channel
    })
   
    const checkoutReply = await CheckoutCardComponent.sendCheckoutCardToChannel(
      {
        channel,
        discordUser: user,
      },
    );

    user.cartChannelId = channel.id;
    user.cartMessageId = checkoutReply.id;

    await discordUserRepository.update(user);
  }
}
