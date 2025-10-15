import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  TextChannel,
} from 'discord.js';
import { AddToCartUsecase } from './_add-to-cart.usecase';

export async function CreateReplyToGoToCheckout({
  interaction,
  channel
}: Parameters<typeof AddToCartUsecase.execute>[0] & { channel: TextChannel }) {
  const embed = new EmbedBuilder()
    .setDescription(
      `✅ **Carrinho de compra criado com sucesso em** ${channel} — ${interaction.user}`,
    )
    .setColor(0x57f287);

  const button = new ButtonBuilder()
    .setLabel('Ir para o carrinho')
    .setStyle(ButtonStyle.Link)
    .setURL(`https://discord.com/channels/${interaction.guildId}/${channel.id}`)
    .setEmoji('🛒');

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

  await interaction.reply({
    embeds: [embed],
    components: [row],
    flags: ['Ephemeral'],
  });
}
