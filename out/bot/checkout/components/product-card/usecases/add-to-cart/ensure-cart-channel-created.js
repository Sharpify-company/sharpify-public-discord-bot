"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EnsureCartChannelCreated", {
    enumerable: true,
    get: function() {
        return EnsureCartChannelCreated;
    }
});
const _lib = require("../../../../../../@shared/lib");
const _discord = require("discord.js");
async function EnsureCartChannelCreated({ interaction, user }) {
    const member = interaction.member;
    if (!member?.user) {
        return (0, _lib.failure)(await interaction.reply({
            content: `Erro ao identificar usuário.`,
            flags: [
                'Ephemeral'
            ]
        }));
    }
    const guild = interaction.guild;
    if (!guild) {
        return (0, _lib.failure)(await interaction.reply({
            content: `Erro ao identificar servidor.`,
            flags: [
                'Ephemeral'
            ]
        }));
    }
    const channelParrent = await interaction.client.channels.cache.get(_lib.dotEnv.CHECKOUT_CATEGORY_ID);
    if (!channelParrent) {
        return (0, _lib.failure)(await interaction.reply({
            content: `Erro ao identificar a categoria do servidor.`,
            flags: [
                'Ephemeral'
            ]
        }));
    }
    if (channelParrent.type !== _discord.ChannelType.GuildCategory) {
        return (0, _lib.failure)(await interaction.reply({
            content: `Erro ao identificar a categoria do servidor: Categoria inválida.`,
            flags: [
                'Ephemeral'
            ]
        }));
    }
    if (user.cart.channelId) {
        const existingChannel = guild.channels.cache.get(user.cart.channelId);
        if (existingChannel) return (0, _lib.success)({
            channel: existingChannel,
            same: true
        });
    }
    // Create the channel
    const textChannel = await guild.channels.create({
        name: `🛒   ---   ${member.user.username}`,
        type: _discord.ChannelType.GuildText,
        parent: channelParrent,
        permissionOverwrites: [
            {
                id: guild.id,
                deny: [
                    _discord.PermissionsBitField.Flags.ViewChannel
                ]
            },
            {
                id: member.user.id,
                allow: [
                    _discord.PermissionsBitField.Flags.ViewChannel,
                    _discord.PermissionsBitField.Flags.ReadMessageHistory
                ]
            }
        ]
    });
    return (0, _lib.success)({
        channel: textChannel,
        same: false
    });
}

//# sourceMappingURL=ensure-cart-channel-created.js.map