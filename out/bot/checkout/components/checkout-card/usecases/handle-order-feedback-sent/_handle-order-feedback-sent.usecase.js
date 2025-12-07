"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HandleOrderFeedbackSentUsecase", {
    enumerable: true,
    get: function() {
        return HandleOrderFeedbackSentUsecase;
    }
});
const _sharpify = require("../../../../../../@shared/sharpify");
const _discord = require("discord.js");
const _lib = require("../../../../../../@shared/lib");
const _common = require("@nestjs/common");
const _config = require("../../../../../../config");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
const sentMessages = new Set();
const sentPublicMessages = new Set();
let HandleOrderFeedbackSentUsecase = class HandleOrderFeedbackSentUsecase {
    async sendPrivateLog({ order, discordUserId }) {
        if (order.feedback.status !== "SENT") return;
        if (sentMessages.has(order.shortReference)) return;
        const storeEntity = await (0, _sharpify.getLocalStoreConfig)();
        const storePreferences = storeEntity.getPreferences();
        if (!storePreferences.feedbackPrivateLog.enabled) return;
        const guild = await this.client.guilds.fetch(process.env.DISCORD_GUILD_ID).catch(()=>null);
        if (!guild) return;
        let member = null;
        member = discordUserId ? await guild.members.fetch(discordUserId).catch(()=>null) : null;
        const channel = await guild.channels.fetch(storePreferences.feedbackPrivateLog.channelId).catch(()=>null);
        if (!channel || channel.type !== _discord.ChannelType.GuildText) return;
        const embed = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle("⭐ Feedback enviado. (Log privado)").setDescription(`Feedback envidado pelo cliente, veja as informações.`);
        embed.addFields([
            {
                name: "`🆔` Referência do pedido:",
                value: `\`\`\`#${order.shortReference}\`\`\``
            }
        ]);
        embed.addFields([
            {
                name: `Email:`,
                value: `\`\`\`${order.customer.email}\`\`\``
            },
            {
                name: "`📅` Enviado em:",
                value: `\`\`\`${new Date(order.feedback.sentAt).toLocaleString("pt-br")}\`\`\``,
                inline: true
            },
            {
                name: "`💸` Valor do pedido:",
                value: `\`\`\`${(0, _lib.formatPrice)(order.pricing.total)}\`\`\``,
                inline: true
            },
            {
                name: `\`⭐\` Estrelas (${order.feedback.rating} de 5):`,
                value: ``
            },
            {
                name: `Comentario:`,
                value: `\`\`\`${order.feedback.content || "Nenhum comentario fornecido."}\`\`\``
            }
        ]);
        if (member) {
            embed.addFields([
                {
                    name: "`👤` Comprador:",
                    value: `${member} (\`${member.user.tag}\`)`
                }
            ]);
        }
        const viewOnWebsiteButton = new _discord.ButtonBuilder().setLabel(`Visualizar no site`).setStyle(_discord.ButtonStyle.Link).setURL(`${storeEntity.url}/checkout/${order.id}`);
        await channel.send({
            embeds: [
                embed
            ],
            components: [
                new _discord.ActionRowBuilder().addComponents(viewOnWebsiteButton)
            ]
        }).catch((err)=>console.log(err));
        sentMessages.add(order.shortReference);
    }
    async sendPublicLog({ order, discordUserId }) {
        if (order.feedback.status !== "SENT") return;
        if (sentPublicMessages.has(order.shortReference)) return;
        const storeEntity = await (0, _sharpify.getLocalStoreConfig)();
        const storePreferences = storeEntity.getPreferences();
        if (!storePreferences.feedbackPublicLog.enabled) return;
        const minStars = storePreferences.feedbackPublicLog.minFeedbackStar || 4;
        if (order.feedback.rating < minStars) return;
        const guild = await this.client.guilds.fetch(process.env.DISCORD_GUILD_ID).catch(()=>null);
        if (!guild) return;
        let member = null;
        member = discordUserId ? await guild.members.fetch(discordUserId).catch(()=>null) : null;
        if (storePreferences.feedbackPublicLog.onlyDiscordSales && !member) return;
        const channel = await guild.channels.fetch(storePreferences.feedbackPublicLog.channelId).catch(()=>null);
        if (!channel || channel.type !== _discord.ChannelType.GuildText) return;
        const embed = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle("⭐ Feedback enviado").setDescription(`Feedback envidado pelo cliente${member ? ` ${member}` : ""}, veja as informações.`);
        embed.addFields([
            {
                name: "`🆔` Referência do pedido:",
                value: `\`\`\`#${order.shortReference}\`\`\``
            }
        ]);
        embed.addFields([
            {
                name: "`📅` Enviado em:",
                value: `\`\`\`${new Date(order.feedback.sentAt).toLocaleString("pt-br")}\`\`\``,
                inline: true
            },
            {
                name: `\`⭐\` Estrelas (${order.feedback.rating} de 5):`,
                value: ``
            },
            {
                name: `Comentario:`,
                value: `\`\`\`${order.feedback.content || "Nenhum comentario fornecido."}\`\`\``
            }
        ]);
        await channel.send({
            embeds: [
                embed
            ]
        }).catch((err)=>console.log(err));
        sentPublicMessages.add(order.shortReference);
    }
    constructor(client){
        this.client = client;
    }
};
HandleOrderFeedbackSentUsecase = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client
    ])
], HandleOrderFeedbackSentUsecase);

//# sourceMappingURL=_handle-order-feedback-sent.usecase.js.map