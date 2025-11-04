"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CartEmmbedComponent", {
    enumerable: true,
    get: function() {
        return CartEmmbedComponent;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
const _config = require("../../../../../config");
const _lib = require("../../../../../@shared/lib");
const _entities = require("../../../../../@shared/db/entities");
const _helpers = require("../../../helpers");
const _helper = require("../helper");
const _sharpify = require("../../../../../@shared/sharpify");
const _helpers1 = require("../../../../../@shared/helpers");
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
let CartEmmbedComponent = class CartEmmbedComponent {
    async makeCartEmmbed({ discordUserId }) {
        await (0, _helpers.ValidateDatabaseCartItemsHelper)({
            discordUserId
        });
        const { name } = await (0, _sharpify.getLocalStoreConfig)();
        const discordUserEntity = await _entities.DiscordUserEntity.findOneBy({
            id: discordUserId
        });
        if (!discordUserEntity) return {
            emmbed: new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle("Compra")
        };
        const discordMember = await this.client.users.fetch(discordUserId);
        if (!discordMember) return {
            emmbed: new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle("Compra")
        };
        const checkoutCartItems = await (0, _helper.getCheckoutCartItemsHelper)({
            discordUserId
        });
        const productList = checkoutCartItems.map((item)=>`• \`\`${item.quantity}x ${(0, _helper.formatCheckoutCartItemNameHelper)(item)} – ${(0, _lib.formatPrice)(item.item.pricing.price)}\`\``).join("\n");
        const ticketEmoji = await (0, _helpers1.FindEmojiHelper)({
            client: this.client,
            name: "Sharpify_ticket"
        });
        const meneyEmoji = await (0, _helpers1.FindEmojiHelper)({
            client: this.client,
            name: "Sharpify_money"
        });
        const cartEmoji = await (0, _helpers1.FindEmojiHelper)({
            client: this.client,
            name: "Sharpify_carrinho"
        });
        const emmbed = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle(`🛒 Carrinho de compras de ${discordMember.displayName}`).setDescription(`Olá ${discordMember}, aqui está o resumo do seu carrinho de compras:`).addFields({
            name: "📦 **Produtos no carrinho**",
            value: productList.length ? productList : "Seu carrinho está vazio."
        }, {
            name: `${meneyEmoji} **Subtotal**`,
            value: "``" + (0, _lib.formatPrice)(discordUserEntity.cart.subTotalPrice) + "``",
            inline: true
        }, {
            name: `${ticketEmoji} **Cupom de desconto**`,
            value: "``" + (discordUserEntity.cart.couponCode ? discordUserEntity.cart.couponCode.toUpperCase() : "Sem cupom aplicado") + "``",
            inline: true
        }, {
            name: `${cartEmoji} **Valor total**`,
            value: "``" + (0, _lib.formatPrice)(discordUserEntity.cart.totalPrice) + "``",
            inline: true
        }).setFooter({
            text: `💼 Sistema de Compra - ©${name} Todos os direitos reservados`
        });
        return {
            emmbed
        };
    }
    async makeSingleCartItemEmmbed({ discordUserId, itemId, productId }) {
        const checkoutCartItems = await (0, _helper.getCheckoutCartItemsHelper)({
            discordUserId
        });
        const { name } = await (0, _sharpify.getLocalStoreConfig)();
        const cartItem = checkoutCartItems.find((item)=>item.item.id === itemId && item.product.id === productId);
        if (!cartItem) return {
            emmbed: new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle("Compra")
        };
        const emmbed = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle(`🛒 Gerenciamento do item`).addFields({
            name: "📦 **Nome do produto**",
            value: `• \`\`${(0, _helper.formatCheckoutCartItemNameHelper)(cartItem)}\`\``
        }, {
            name: "🧾 **Subtotal**",
            value: `\`\`${(0, _lib.formatPrice)(cartItem.item.pricing.price)}\`\``,
            inline: true
        }, {
            name: "🏷️ **Quantidade selecionada**",
            value: `\`\`${cartItem.quantity} de ${cartItem.item.inventory.stockQuantity === null ? "Ilimitado" : `${cartItem.item.inventory.stockQuantity} unidades`}\`\``,
            inline: true
        }, {
            name: "💰 **Valor total**",
            value: `\`\`${(0, _lib.formatPrice)(cartItem.item.pricing.price * cartItem.quantity)}\`\``,
            inline: true
        }).setFooter({
            text: `💼 Sistema de Compra - ©${name} Todos os direitos reservados`
        });
        return {
            emmbed
        };
    }
    constructor(client){
        this.client = client;
    }
};
CartEmmbedComponent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client
    ])
], CartEmmbedComponent);

//# sourceMappingURL=cart-emmbed.js.map