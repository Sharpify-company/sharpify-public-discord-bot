"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductCardModule", {
    enumerable: true,
    get: function() {
        return ProductCardModule;
    }
});
const _common = require("@nestjs/common");
const _productcard = require("./product-card");
const _addtocartbutton = require("./components/add-to-cart-button");
const _events = require("./events");
const _usecases = require("./usecases");
const _checkoutcard = require("../checkout-card/checkout-card");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ProductCardModule = class ProductCardModule {
};
ProductCardModule = _ts_decorate([
    (0, _common.Global)(),
    (0, _common.Module)({
        imports: [],
        controllers: [],
        providers: [
            _productcard.ProductCardComponent,
            _addtocartbutton.AddToCartButtonComponent,
            _events.AddToCartEvent,
            _usecases.AddToCartUsecase,
            _checkoutcard.CheckoutCardComponent
        ],
        exports: [
            _addtocartbutton.AddToCartButtonComponent,
            _productcard.ProductCardComponent
        ]
    })
], ProductCardModule);

//# sourceMappingURL=product-card.module.js.map