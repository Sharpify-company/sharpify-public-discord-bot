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
    get InputDto () {
        return InputDto;
    },
    get ListProductsCommand () {
        return ListProductsCommand;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
const _necord = require("necord");
const _autocompleteproductinterceptor = require("./auto-complete-product.interceptor");
const _sharpify = require("../../../../@shared/sharpify");
const _config = require("../../../../config");
const _turndown = /*#__PURE__*/ _interop_require_default(require("turndown"));
const _helpers = require("../../../../@shared/helpers");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
const turndownService = new _turndown.default();
let InputDto = class InputDto {
};
_ts_decorate([
    (0, _necord.StringOption)({
        name: "titulo",
        description: "Título do produto",
        required: true,
        max_length: 100,
        autocomplete: true
    }),
    _ts_metadata("design:type", String)
], InputDto.prototype, "productIdAndItemId", void 0);
_ts_decorate([
    (0, _necord.UserOption)({
        name: "usuario",
        description: "Usuário que receberá o produto",
        required: true
    }),
    _ts_metadata("design:type", typeof _discord.User === "undefined" ? Object : _discord.User)
], InputDto.prototype, "user", void 0);
_ts_decorate([
    (0, _necord.NumberOption)({
        name: "quantidade",
        description: "Quantidade de produtos a serem entregues",
        required: true,
        min_value: 1,
        max_value: 100
    }),
    _ts_metadata("design:type", Number)
], InputDto.prototype, "quantity", void 0);
let ListProductsCommand = class ListProductsCommand {
    async onListProducts([interaction], { productIdAndItemId, user, quantity }) {
        const [productId, productItemId] = productIdAndItemId.split(":");
        const productReq = await _sharpify.Sharpify.api.v1.catalog.product.get({
            id: productId,
            includeNonListed: true
        });
        if (!productReq.success) {
            return interaction.reply({
                content: `Error ao buscar produto: ${productReq.errorName}`,
                flags: [
                    "Ephemeral"
                ]
            });
        }
        const StockReq = await _sharpify.Sharpify.api.v1.catalog.product.decreseStock({
            productId,
            productItemId,
            quantity
        });
        if (!StockReq.success) {
            let errorMessage = StockReq.errorName;
            if (StockReq.errorName === "InsufficientStockError") {
                errorMessage = `Estoque insuficiente para entregar ${quantity} unidade(s) deste produto.`;
            }
            return interaction.reply({
                content: `Error ao buscar produto: ${errorMessage}`,
                flags: [
                    "Ephemeral"
                ]
            });
        }
        const staticStock = StockReq.data.type === "STATIC" ? StockReq.data.stock : "Sem stoque";
        const lineStocks = StockReq.data.type === "LINES" ? JSON.parse(StockReq.data.stock || "[]") : [];
        const boxIcon = await (0, _helpers.FindEmojiHelper)({
            client: interaction.client,
            name: "Sharpify_caixa"
        });
        const cartIcon = await (0, _helpers.FindEmojiHelper)({
            client: interaction.client,
            name: "Sharpify_carrinho"
        });
        const product = productReq.data.product;
        const productEmbed = new _discord.EmbedBuilder().setTitle(`${boxIcon} **Produto entregue por um administrador!**`).setDescription(`🎉 Você recebeu alguns produtos do admistrador ${interaction.user}`).setColor(_config.BotConfig.color).addFields({
            name: `${boxIcon} Produto:`,
            value: `\`\`${product.settings.viewType === "NORMAL" ? product.info.title : `${product.info.title} -> ${product.dynamicItems.find((item)=>item.id === productItemId)?.info.title || "Sem nome"}`}\`\``,
            inline: true
        }).addFields({
            name: `${cartIcon} Quantidade:`,
            value: `\`\`${quantity} unidades\`\``,
            inline: true
        });
        const deliveryEmbed = new _discord.EmbedBuilder().setTitle(`${boxIcon} **Entrega do produto: ${quantity} de ${quantity}**`).setColor(_config.BotConfig.color);
        if (StockReq.data.type === "STATIC") {
            deliveryEmbed.addFields({
                name: `Estoque:`,
                value: `\`\`${staticStock}\`\``
            });
        } else if (StockReq.data.type === "LINES") {
            deliveryEmbed.addFields({
                name: `Estoques:`,
                value: lineStocks.map((lineStock)=>`\`\`${lineStock}\`\``).join("\n")
            });
        }
        try {
            const dm = await user.createDM().catch(()=>null);
            await dm?.send({
                content: `Olá ${user}! 👋\nUm administrador entregou estoque para você!`,
                embeds: [
                    productEmbed,
                    deliveryEmbed
                ]
            });
            return interaction.reply({
                content: `Estoque entregue com sucesso para o usuário ${user}. \n Veja a mensagem enviada:`,
                embeds: [
                    productEmbed,
                    deliveryEmbed
                ],
                components: [],
                flags: [
                    "Ephemeral"
                ]
            });
        } catch (error) {
            return interaction.reply({
                content: `Estoque foi removido do estoque. Mas não foi possível enviar a mensagem direta ao usuário. `
            });
        }
    }
    constructor(){}
};
_ts_decorate([
    (0, _common.UseInterceptors)(_autocompleteproductinterceptor.ProductAutocompleteInterceptor),
    (0, _necord.SlashCommand)({
        name: "entregar-produto",
        description: "[📦] Entregue um produto sem a necessidade de uma compra.",
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
], ListProductsCommand.prototype, "onListProducts", null);
ListProductsCommand = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], ListProductsCommand);

//# sourceMappingURL=delivery-products.command.js.map