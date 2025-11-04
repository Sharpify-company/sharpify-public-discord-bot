"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RemoveFromCartButtonComponent", {
    enumerable: true,
    get: function() {
        return RemoveFromCartButtonComponent;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _sectionmanager = require("../section-manager");
const _types = require("../../../../../@shared/types");
const _usecases = require("../usecases");
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
let RemoveFromCartButtonComponent = class RemoveFromCartButtonComponent {
    async handleButtonClicked([interaction], productIdAndItemId) {
        const [productId, productItemId] = productIdAndItemId.split(":");
        const { cartIsEmpty } = await _usecases.RemoveFromCartUsecase.execute({
            discordUserId: interaction.user.id,
            productId,
            productItemId
        });
        await interaction.deferUpdate();
        if (cartIsEmpty) return interaction.channel?.delete();
        const result = await this.sectionManagerHandler.setSection({
            discordUserId: interaction.user.id,
            section: "MAIN"
        });
        await interaction.message.edit(result);
    }
    async createButton({ productId, productItemId }) {
        const removeFromCartButton = new _discord.ButtonBuilder().setCustomId(`remove_from_cart${productId}:${productItemId}`) // unique ID to handle clicks
        .setLabel("Remover do carrinho") // text on the button
        .setStyle(_discord.ButtonStyle.Danger) // gray button, like in the image
        .setEmoji("🗑️");
        return {
            removeFromCartButton
        };
    }
    constructor(client, sectionManagerHandler){
        this.client = client;
        this.sectionManagerHandler = sectionManagerHandler;
    }
};
_ts_decorate([
    (0, _necord.Button)("remove_from_cart:productIdAndItemId"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_param(1, (0, _necord.ComponentParam)("productIdAndItemId")),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], RemoveFromCartButtonComponent.prototype, "handleButtonClicked", null);
RemoveFromCartButtonComponent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_sectionmanager.SectionManagerHandler))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType
    ])
], RemoveFromCartButtonComponent);

//# sourceMappingURL=remove-from-cart-button.js.map