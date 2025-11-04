"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateReplyToGoToCheckout", {
    enumerable: true,
    get: function() {
        return CreateReplyToGoToCheckout;
    }
});
const _discord = require("discord.js");
async function CreateReplyToGoToCheckout({ interaction, channel }) {
    const embed = new _discord.EmbedBuilder().setDescription(`✅ **Carrinho de compra criado com sucesso em** ${channel} — ${interaction.user}`).setColor(0x57f287);
    const button = new _discord.ButtonBuilder().setLabel('Ir para o carrinho').setStyle(_discord.ButtonStyle.Link).setURL(`https://discord.com/channels/${interaction.guildId}/${channel.id}`).setEmoji('🛒');
    const row = new _discord.ActionRowBuilder().addComponents(button);
    await interaction.reply({
        embeds: [
            embed
        ],
        components: [
            row
        ],
        flags: [
            'Ephemeral'
        ]
    });
}

//# sourceMappingURL=create-reply-to-go-to-checkout.js.map