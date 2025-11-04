"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddToCartButtonComponent", {
    enumerable: true,
    get: function() {
        return AddToCartButtonComponent;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
const _lib = require("../../../../../@shared/lib");
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
let AddToCartButtonComponent = class AddToCartButtonComponent {
    async createDynamicItemsSelect(product) {
        const options = product.dynamicItems.map((item)=>({
                label: `${item.info.title}`,
                description: `💸 Valor: ${(0, _lib.formatPrice)(item.pricing.price)} | 📦 Estoque ${item.inventory.stockQuantity === null ? "Ilimitado" : `${item.inventory.stockQuantity} unidades`}`,
                value: item.id,
                emoji: product.readonly.stockQuantityAvailable !== null && product.readonly.stockQuantityAvailable <= 0 ? "❌" : "🛒"
            }));
        const selectMenu = new _discord.StringSelectMenuBuilder().setCustomId(`add_to_cart_${product.id}`).setPlaceholder("Selecione um item...").addOptions(options);
        const row = new _discord.ActionRowBuilder().addComponents(selectMenu);
        return row;
    }
    createCartButton(product) {
        // Cria o botão
        const button = new _discord.ButtonBuilder().setCustomId(`add_to_cart_${product.id}:${product.normalItem.id}`).setLabel(`🛒 Adicionar ao carrinho`).setDisabled(product.readonly.stockQuantityAvailable !== null && product.readonly.stockQuantityAvailable <= 0).setStyle(_discord.ButtonStyle.Success);
        // Coloca o botão dentro de uma action row
        const row = new _discord.ActionRowBuilder().addComponents(button);
        return row;
    }
    constructor(client){
        this.client = client;
    }
};
AddToCartButtonComponent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client
    ])
], AddToCartButtonComponent);

//# sourceMappingURL=add-to-cart-button.js.map