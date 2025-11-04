"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ListProductsModule", {
    enumerable: true,
    get: function() {
        return ListProductsModule;
    }
});
const _common = require("@nestjs/common");
const _productemmbed = require("./components/_product-emmbed");
const _listproductscommand = require("./list-products.command");
const _selectsetproductonchannel = require("./components/select-set-product-on-channel");
const _components = require("../../../checkout/components");
const _createconfigbutton = require("./components/create-config-button");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ListProductsModule = class ListProductsModule {
};
ListProductsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [],
        controllers: [],
        providers: [
            _listproductscommand.ListProductsCommand,
            _productemmbed.ProductEmmbed,
            _selectsetproductonchannel.SelectSetProductOnChannel,
            _components.ProductCardComponent,
            _createconfigbutton.CreateConfigButtonComponent
        ]
    })
], ListProductsModule);

//# sourceMappingURL=list-products.module.js.map