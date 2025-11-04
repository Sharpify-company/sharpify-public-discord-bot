"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductCardComponent", {
    enumerable: true,
    get: function() {
        return ProductCardComponent;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
const _config = require("../../../../config");
const _lib = require("../../../../@shared/lib");
const _turndown = /*#__PURE__*/ _interop_require_default(require("turndown"));
const _addtocartbutton = require("./components/add-to-cart-button");
const _memorycreateconfig = require("../../../products/commands/list-products/memory-create-config");
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
let ProductCardComponent = class ProductCardComponent {
    getProductEmbed(product) {
        const emmbed = new _discord.EmbedBuilder().setColor(_memorycreateconfig.MemoryCreateConfig.get(product.id)?.color || _config.BotConfig.color).setTitle("Sistema de compra").setDescription(product.info.discordDescription || new _turndown.default().turndown(product.info.description || "") || "Sem descrição").setImage(product.info.discordMainImage || product.info.mainImage || "");
        if (product.settings.viewType === "NORMAL") {
            emmbed.addFields({
                name: "🌐 Produto",
                value: `\`\`\`${product.info.title}\`\`\``
            }, {
                name: "💵 Valor",
                value: `\`\`\`${(0, _lib.formatPrice)(product.pricing.price)}\`\`\``,
                inline: true
            }, {
                name: "📦 Estoque disponível pra compra",
                value: product.readonly.stockQuantityAvailable === null ? `\`\`\`∞ Ilimitado\`\`\`` : `\`\`\`${product.readonly.stockQuantityAvailable} Unidades\`\`\``,
                inline: true
            });
        }
        return emmbed;
    }
    async getProductCard(product) {
        const normalEmmbed = this.getProductEmbed(product);
        const normalPurchaseButton = product.settings.viewType === "NORMAL" ? this.addToCartButtonComponent.createCartButton(product) : await this.addToCartButtonComponent.createDynamicItemsSelect(product);
        return {
            normalEmmbed,
            normalPurchaseButton
        };
    }
    async sendProductCardToChannel({ channel, product }) {
        const { normalEmmbed, normalPurchaseButton } = await this.getProductCard(product);
        const reply = await channel.send({
            embeds: [
                normalEmmbed
            ],
            components: [
                normalPurchaseButton
            ]
        });
        return reply;
    }
    constructor(addToCartButtonComponent){
        this.addToCartButtonComponent = addToCartButtonComponent;
    }
};
ProductCardComponent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _addtocartbutton.AddToCartButtonComponent === "undefined" ? Object : _addtocartbutton.AddToCartButtonComponent
    ])
], ProductCardComponent);

//# sourceMappingURL=product-card.js.map