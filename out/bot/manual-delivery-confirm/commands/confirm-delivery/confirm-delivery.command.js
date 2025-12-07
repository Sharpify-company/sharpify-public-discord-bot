"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ConfirmDeliveryCommand () {
        return ConfirmDeliveryCommand;
    },
    get InputDto () {
        return InputDto;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
const _necord = require("necord");
const _sharpify = require("../../../../@shared/sharpify");
const _config = require("../../../../config");
const _lib = require("../../../../@shared/lib");
const _autocompleteorderinterceptor = require("./auto-complete-order.interceptor");
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
let InputDto = class InputDto {
};
_ts_decorate([
    (0, _necord.StringOption)({
        name: "venda",
        description: "ID da venda a ser confirmada",
        required: true,
        max_length: 100,
        autocomplete: true
    }),
    _ts_metadata("design:type", String)
], InputDto.prototype, "orderId", void 0);
_ts_decorate([
    (0, _necord.StringOption)({
        name: "item",
        description: "Item da venda a ser confirmado",
        required: true,
        max_length: 100,
        autocomplete: true
    }),
    _ts_metadata("design:type", String)
], InputDto.prototype, "orderItemId", void 0);
_ts_decorate([
    (0, _necord.UserOption)({
        name: "usuario",
        description: "Usuário que recebeu a entrega",
        required: true
    }),
    _ts_metadata("design:type", typeof _discord.User === "undefined" ? Object : _discord.User)
], InputDto.prototype, "user", void 0);
let ConfirmDeliveryCommand = class ConfirmDeliveryCommand {
    async onListOrder([interaction], { orderId, orderItemId, user }) {
        const order = await _sharpify.Sharpify.api.v1.checkout.order.getOrder({
            orderId
        });
        if (!order.success) {
            return interaction.reply({
                content: `Error ao buscar a venda: ${order.errorName}`,
                flags: [
                    "Ephemeral"
                ]
            });
        }
        const orderItem = order.data.order.orderItems.find((item)=>item.id === orderItemId);
        if (!orderItem) {
            return interaction.reply({
                content: `Error ao buscar o item da venda.`,
                flags: [
                    "Ephemeral"
                ]
            });
        }
        const storeEntity = await (0, _sharpify.getLocalStoreConfig)();
        const preferences = storeEntity.getPreferences();
        if (!preferences.confirmDelivery.enabled) {
            return interaction.reply({
                content: `O log publico de confirmação de entrega não está habilitado nas preferências da loja.`,
                flags: [
                    "Ephemeral"
                ]
            });
        }
        const guild = await this.client.guilds.fetch(_lib.dotEnv.DISCORD_GUILD_ID).catch(()=>null);
        if (!guild) {
            return interaction.reply({
                content: `Error ao buscar o servidor do Discord.`,
                flags: [
                    "Ephemeral"
                ]
            });
        }
        const channel = await guild.channels.fetch(preferences.confirmDelivery.channelId).catch(()=>null);
        if (!channel || !channel.isTextBased()) {
            return interaction.reply({
                content: `Error ao buscar o canal de log publico de confirmação de entrega.`,
                flags: [
                    "Ephemeral"
                ]
            });
        }
        const emmbed = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle("Entrega Confirmada!").setDescription(`Pedido entregue pelo administrador ${interaction.user} para o cliente ${user}.`);
        const productName = orderItem.product.backup.viewType === "NORMAL" ? orderItem.product.backup.title : `${orderItem.product.backup.title} > ${orderItem.product.itemBackup.title}`;
        emmbed.addFields({
            name: "🆔 Referência",
            value: `\`\`\`#${order.data.order.shortReference}\`\`\``,
            inline: false
        }, {
            name: "🌐 Produto",
            value: `\`\`\`${productName}\`\`\``,
            inline: true
        }, {
            name: "📦 Quantidade",
            value: `\`\`\`${orderItem.quantity}\`\`\``,
            inline: true
        });
        const viewProductButton = new _discord.ButtonBuilder().setLabel("Visualizar produto no site").setStyle(_discord.ButtonStyle.Link).setURL(`${storeEntity.url}/product/${orderItem.product.productId}`);
        await channel.send({
            content: `${user}`,
            embeds: [
                emmbed
            ],
            components: [
                {
                    type: 1,
                    components: [
                        viewProductButton
                    ]
                }
            ]
        });
        return interaction.reply({
            content: `Confirmação de entrega enviada com sucesso para o canal ${channel}.`,
            flags: [
                "Ephemeral"
            ]
        });
    }
    constructor(client){
        this.client = client;
    }
};
_ts_decorate([
    (0, _common.UseInterceptors)(_autocompleteorderinterceptor.OrderAutocompleteInterceptor),
    (0, _necord.SlashCommand)({
        name: "confirmar-entrega",
        description: "Mande um log publico de confirmação de entrega de um produto!",
        defaultMemberPermissions: [
            "Administrator"
        ]
    }),
    _ts_param(0, (0, _necord.Context)()),
    _ts_param(1, (0, _necord.Options)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _necord.SlashCommandContext === "undefined" ? Object : _necord.SlashCommandContext,
        typeof InputDto === "undefined" ? Object : InputDto
    ]),
    _ts_metadata("design:returntype", Promise)
], ConfirmDeliveryCommand.prototype, "onListOrder", null);
ConfirmDeliveryCommand = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client
    ])
], ConfirmDeliveryCommand);

//# sourceMappingURL=confirm-delivery.command.js.map