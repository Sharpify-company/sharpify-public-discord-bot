"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductAutocompleteInterceptor", {
    enumerable: true,
    get: function() {
        return ProductAutocompleteInterceptor;
    }
});
const _lib = require("../../../../@shared/lib");
const _sharpify = require("../../../../@shared/sharpify");
const _common = require("@nestjs/common");
const _necord = require("necord");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ProductAutocompleteInterceptor = class ProductAutocompleteInterceptor extends _necord.AutocompleteInterceptor {
    async transformOptions(interaction) {
        const focused = interaction.options.getFocused(true);
        if (focused.name !== "titulo") return;
        const req = await _sharpify.Sharpify.api.v1.catalog.product.list({
            limit: 10,
            page: 1,
            title: focused.value.toString(),
            productItemTitle: focused.value.toString()
        });
        if (!req.success) return interaction.respond([
            {
                name: `Error ao buscar produtos: ${req.errorName}`,
                value: "0"
            }
        ]);
        const productItems = [];
        for (const product of req.data.products){
            if (product.settings.viewType === "NORMAL") {
                productItems.push({
                    product,
                    item: product.normalItem
                });
            } else {
                productItems.push(...product.dynamicItems.map((item)=>({
                        product,
                        item
                    })));
            }
        }
        return interaction.respond(productItems.filter(({ item })=>item.info.title.includes(focused.value.toString())).map(({ item, product })=>{
            let title = product.settings.viewType === "NORMAL" ? product.info.title : `${product.info.title} ➡️ ${item.info.title}`;
            return {
                name: `${title.slice(0, 50)}  |  ${(0, _lib.formatPrice)(item.pricing.price)} | 📦 ${item.inventory.stockQuantity === null ? "Estoque ilimitado" : `${item.inventory.stockQuantity} em estoque`}`,
                value: `${product.id}:${item.id}`
            };
        }));
    }
};
ProductAutocompleteInterceptor = _ts_decorate([
    (0, _common.Injectable)()
], ProductAutocompleteInterceptor);

//# sourceMappingURL=auto-complete-product.interceptor.js.map