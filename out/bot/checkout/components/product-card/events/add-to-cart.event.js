"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddToCartEvent", {
    enumerable: true,
    get: function() {
        return AddToCartEvent;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _usecases = require("../usecases");
const _productcard = require("../product-card");
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
let AddToCartEvent = class AddToCartEvent {
    async handleButtonClicked([interaction], productIdAndItemId) {
        const [productId, productItemId] = productIdAndItemId.split(":");
        await this.addToCart({
            interaction,
            productId,
            productItemId
        });
    }
    async handleDyamic([interaction], productId, selected) {
        const [productItemId] = selected;
        await this.addToCart({
            interaction: interaction,
            productId,
            productItemId
        });
    }
    async addToCart({ interaction, productId, productItemId }) {
        await this.addToCartUsecase.execute({
            interaction,
            productId,
            productItemId
        });
    }
    constructor(addToCartUsecase, productCardComponent){
        this.addToCartUsecase = addToCartUsecase;
        this.productCardComponent = productCardComponent;
    }
};
_ts_decorate([
    (0, _necord.Button)("add_to_cart_:productIdAndItemId"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_param(1, (0, _necord.ComponentParam)("productIdAndItemId")),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AddToCartEvent.prototype, "handleButtonClicked", null);
_ts_decorate([
    (0, _necord.StringSelect)("add_to_cart_:productId"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_param(1, (0, _necord.ComponentParam)("productId")),
    _ts_param(2, (0, _necord.SelectedStrings)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _necord.StringSelectContext === "undefined" ? Object : _necord.StringSelectContext,
        String,
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], AddToCartEvent.prototype, "handleDyamic", null);
AddToCartEvent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usecases.AddToCartUsecase === "undefined" ? Object : _usecases.AddToCartUsecase,
        typeof _productcard.ProductCardComponent === "undefined" ? Object : _productcard.ProductCardComponent
    ])
], AddToCartEvent);

//# sourceMappingURL=add-to-cart.event.js.map