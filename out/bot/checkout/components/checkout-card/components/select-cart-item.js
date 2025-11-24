"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SelectCartItemComponent", {
    enumerable: true,
    get: function() {
        return SelectCartItemComponent;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _lib = require("../../../../../@shared/lib");
const _helpers = require("../../../helpers");
const _helper = require("../helper");
const _sectionmanager = require("../section-manager");
const _types = require("../../../../../@shared/types");
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
let SelectCartItemComponent = class SelectCartItemComponent {
    async handleItemSelected([interaction], selected) {
        const [productId, productItemId] = selected.at(0)?.split(":");
        const result = await this.sectionManagerHandler.setSection({
            discordUserId: interaction.user.id,
            section: "CART_ITEM",
            productId,
            itemId: productItemId
        });
        await interaction.deferUpdate();
        await interaction.message.edit(result);
    }
    async createSelect({ discordUserId, defaultItemId }) {
        await (0, _helpers.ValidateDatabaseCartItemsHelper)({
            discordUserId
        });
        const checkoutCartItems = await (0, _helper.getCheckoutCartItemsHelper)({
            discordUserId
        });
        const options = checkoutCartItems.map((item)=>({
                label: (0, _helper.formatCheckoutCartItemNameHelper)(item).slice(0, 100),
                description: `💸 Valor: ${(0, _lib.formatPrice)(item.item.pricing.price)} | 📦 Estoque ${item.item.inventory.stockQuantity === null ? "Ilimitado" : `${item.item.inventory.stockQuantity} unidades`}`,
                value: `${item.product.id}:${item.item.id}`,
                emoji: "🛒",
                default: defaultItemId ? item.item.id === defaultItemId : false
            })).slice(0, 24); // Discord limit
        const selectMenu = new _discord.StringSelectMenuBuilder().setCustomId(`cart_item_select`).setPlaceholder("📦 Edite a quantidade ou remova o item do carrinho").addOptions(options);
        const row = new _discord.ActionRowBuilder().addComponents(selectMenu);
        return {
            row
        };
    }
    constructor(client, sectionManagerHandler){
        this.client = client;
        this.sectionManagerHandler = sectionManagerHandler;
    }
};
_ts_decorate([
    (0, _necord.StringSelect)("cart_item_select"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_param(1, (0, _necord.SelectedStrings)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _necord.StringSelectContext === "undefined" ? Object : _necord.StringSelectContext,
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], SelectCartItemComponent.prototype, "handleItemSelected", null);
SelectCartItemComponent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_sectionmanager.SectionManagerHandler))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType
    ])
], SelectCartItemComponent);

//# sourceMappingURL=select-cart-item.js.map