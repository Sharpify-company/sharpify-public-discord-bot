"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SendPublicSalesLogUsecase", {
    enumerable: true,
    get: function() {
        return SendPublicSalesLogUsecase;
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
let SendPublicSalesLogUsecase = class SendPublicSalesLogUsecase {
    async execute({ discordUserId, orderProps }) {
        if (sentMessages.has(orderProps.shortReference)) return;
        const storePreferences = (await (0, _sharpify.getLocalStoreConfig)()).getPreferences();
        if (!storePreferences.publicLogSales.enabled) return;
        const guild = await this.client.guilds.fetch(process.env.DISCORD_GUILD_ID).catch(()=>null);
        if (!guild) return;
        let member = null;
        member = discordUserId ? await guild.members.fetch(discordUserId).catch(()=>null) : null;
        if (storePreferences.publicLogSales.onlyDiscordSales && !member) return;
        const channel = await guild.channels.fetch(storePreferences.publicLogSales.channelId).catch(()=>null);
        if (!channel || channel.type !== _discord.ChannelType.GuildText) return;
        const embed = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle("🛒 Nova compra feita.").setDescription(`Compra feito com successo e com segurança.`);
        embed.addFields([
            {
                name: "`🆔` ID do pedido:",
                value: `\`\`\`#${orderProps.shortReference}\`\`\``
            },
            {
                name: "`📦` Produtos comprado:",
                value: `\`\`\`${orderProps.orderItems.map((item)=>`・ ${item.product.backup.title}${item.product.backup.viewType === "DYNAMIC" ? ` > ${item.product.itemBackup?.title}` : ""} (${item.quantity}x)`).join("\n")}\`\`\``
            }
        ]);
        embed.addFields([
            {
                name: "`📅` Pedido feito em:",
                value: `\`\`\`${new Date(orderProps.createdAt).toLocaleString("pt-br")}\`\`\``
            },
            {
                name: "`💸` Valor total:",
                value: `\`\`\`${(0, _lib.formatPrice)(orderProps.pricing.total)}\`\`\``
            }
        ]);
        if (member) {
            embed.addFields([
                {
                    name: "`👤` Comprador:",
                    value: `Muito obrigado  ${member} por comprar em nossa loja!`
                }
            ]);
        }
        await channel.send({
            embeds: [
                embed
            ]
        }).catch((err)=>console.log(err));
        sentMessages.add(orderProps.shortReference);
    }
    constructor(client){
        this.client = client;
    }
};
SendPublicSalesLogUsecase = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client
    ])
], SendPublicSalesLogUsecase);

//# sourceMappingURL=send-public-sales-log.usecase.js.map