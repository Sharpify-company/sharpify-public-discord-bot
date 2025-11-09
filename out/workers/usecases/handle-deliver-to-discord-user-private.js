"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HandleDeliverToDiscordUserPrivate", {
    enumerable: true,
    get: function() {
        return HandleDeliverToDiscordUserPrivate;
    }
});
const _lib = require("../../@shared/lib");
const _sharpify = require("../../@shared/sharpify");
const _config = require("../../config");
const _logchannelservice = require("../../log-channel.service");
const _common = require("@nestjs/common");
const _discord = require("discord.js");
require("necord");
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
let HandleDeliverToDiscordUserPrivate = class HandleDeliverToDiscordUserPrivate {
    async getUserDMChannelEmbed({ orderEntity, user }) {
        const fields = [];
        const { url } = await (0, _sharpify.getLocalStoreConfig)();
        const ViewOnWebsiteButton = new _discord.ButtonBuilder().setLabel("Visualizar compra no site") // text on the button
        .setStyle(_discord.ButtonStyle.Link) // gray button, like in the image
        .setEmoji("🔗").setURL(`${url}/checkout/${orderEntity.id}`);
        let fileAttachments = [];
        for (const orderItem of orderEntity.orderProps.orderItems){
            fields.push({
                name: `🛒 Produto:`,
                value: `\`\`\`${orderItem.product.backup.title} ${orderItem.product.backup.viewType === "DYNAMIC" ? `> ${orderItem.product.itemBackup.title}` : ""}\`\`\``
            });
            fields.push({
                name: `Quantidade:`,
                value: `\`\`${orderItem.quantity}X\`\``,
                inline: true
            });
            fields.push({
                name: `💵 Preço:`,
                value: `\`\`${(0, _lib.formatPrice)(orderItem.pricing.total)}\`\``,
                inline: true
            });
            if (orderItem.product.itemBackup.stockType === "STATIC") {
                if (orderItem.product?.itemBackup?.stockContent?.length > 1024) {
                    // cria um arquivo temporário com o conteúdo do estoque
                    const fileContent = `Estoque:\n${orderItem.product?.itemBackup?.stockContent}`;
                    fileAttachments.push(new _discord.AttachmentBuilder(Buffer.from(fileContent), {
                        name: "estoque.txt"
                    }));
                    fields.push({
                        name: "Estoque:",
                        value: "📄 Estoque muito grande — veja o arquivo `estoque.txt` em anexo."
                    });
                } else {
                    fields.push({
                        name: `Estoque:`,
                        value: `\`\`\`${orderItem.product.itemBackup.stockContent}\`\`\``
                    });
                }
            } else if (orderItem.product.itemBackup.stockType === "LINES") {
                const joined = orderItem.product.itemBackup.stockContent.map((lineStock)=>`\`\`\`${lineStock}\`\`\``).join("\n");
                if (joined.length > 1024) {
                    const fileContent = `Estoques:\n${joined}`;
                    fileAttachments.push(new _discord.AttachmentBuilder(Buffer.from(fileContent), {
                        name: "estoques.txt"
                    }));
                    fields.push({
                        name: "Estoques:",
                        value: "📄 Lista muito grande — veja o arquivo `estoques.txt` em anexo."
                    });
                } else {
                    fields.push({
                        name: `Estoque:`,
                        value: joined
                    });
                }
            }
            fields.push({
                name: "\u200b",
                value: ""
            }); // Empty field for spacing
        }
        const embed = new _discord.EmbedBuilder().setDescription("Detalhes do pedido...").setColor(_config.BotConfig.color).addFields(fields).setFooter({
            text: "Obrigado por comprar conosco! ❤️"
        });
        return {
            content: `Olá ${user}! 👋\nSeu pedido #${orderEntity.orderProps.shortReference} foi entregue com sucesso!`,
            embeds: [
                embed
            ],
            components: [
                {
                    type: 1,
                    components: [
                        ViewOnWebsiteButton
                    ]
                }
            ],
            files: fileAttachments
        };
    }
    async execute({ orderEntity }) {
        // 1️⃣ Get the user by ID
        const user = await this.client.users.fetch(orderEntity.customerId).catch(()=>null);
        if (!user) {
            console.warn(`User with ID ${orderEntity.customerId} not found.`);
            return;
        }
        const dm = await user.createDM();
        try {
            await dm.send(await this.getUserDMChannelEmbed({
                orderEntity,
                user
            }));
        } catch (error) {
            if (error.code === 50007) {
                // Optionally: notify them in a public channel or log internally
                const emmbed = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle("❌ Não foi possível enviar uma DM de entrega").setDescription(`Não foi possível enviar uma DM para o usuário ${user}. As DMs estão fechadas.`).addFields({
                    name: "👤 Usuário",
                    value: `\`\`\`${user.tag} (${user.id})\`\`\``
                }, {
                    name: "📦 ID do Pedido",
                    value: `\`\`\`${orderEntity.id}\`\`\``
                }, {
                    name: "🆔 Referência Curta",
                    value: `\`\`\`${orderEntity.orderProps.shortReference}\`\`\``
                }, {
                    name: "💵 Valor do pedido",
                    value: `\`\`\`${(0, _lib.formatPrice)(orderEntity.orderProps.pricing.total)}\`\`\``
                });
                await this.logChannel.sendMessage({
                    embeds: [
                        emmbed
                    ]
                });
            } else {
                const emmbed = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle("❌ Não foi possível enviar uma DM de entrega").setDescription(`Não foi possível enviar uma DM para o usuário ${user}. Error tecnico aconteceu.`).addFields({
                    name: "👤 Usuário",
                    value: `\`\`\`${user.tag} (${user.id})\`\`\``
                }, {
                    name: "📦 ID do Pedido",
                    value: `\`\`\`${orderEntity.id}\`\`\``
                }, {
                    name: "🆔 Referência Curta",
                    value: `\`\`\`${orderEntity.orderProps.shortReference}\`\`\``
                }, {
                    name: "💵 Valor do pedido",
                    value: `\`\`\`${(0, _lib.formatPrice)(orderEntity.orderProps.pricing.total)}\`\`\``
                });
                await this.logChannel.sendMessage({
                    embeds: [
                        emmbed
                    ]
                });
                console.error("Unexpected error sending DM:", error);
            }
            await orderEntity.markAsFailed();
            return;
        }
        await orderEntity.markAsDelivered();
    }
    constructor(client, logChannel){
        this.client = client;
        this.logChannel = logChannel;
    }
};
HandleDeliverToDiscordUserPrivate = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _logchannelservice.LogChannel === "undefined" ? Object : _logchannelservice.LogChannel
    ])
], HandleDeliverToDiscordUserPrivate);

//# sourceMappingURL=handle-deliver-to-discord-user-private.js.map