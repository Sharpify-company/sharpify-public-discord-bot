"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OrderAutocompleteInterceptor", {
    enumerable: true,
    get: function() {
        return OrderAutocompleteInterceptor;
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
let OrderAutocompleteInterceptor = class OrderAutocompleteInterceptor extends _necord.AutocompleteInterceptor {
    async transformOptions(interaction) {
        const focused = interaction.options.getFocused(true);
        if (focused.name === "item") {
            const orderId = interaction.options.getString("venda");
            if (!orderId) {
                return interaction.respond([]);
            }
            const reqOrder = await _sharpify.Sharpify.api.v1.checkout.order.getOrder({
                orderId
            });
            if (!reqOrder.success) {
                if (reqOrder.errorName === "OrderNotFoundError") {
                    return interaction.respond([]);
                }
                return interaction.respond([
                    {
                        name: `Error ao buscar a compra: ${reqOrder.errorName}`,
                        value: "0"
                    }
                ]);
            }
            const items = reqOrder.data.order.orderItems.map((item)=>({
                    name: `${item.product.backup.viewType === "NORMAL" ? item.product.backup.title : `${item.product.backup.title} > ${item.product.itemBackup.title}`} (Qty: ${item.quantity})`,
                    value: item.id
                }));
            return interaction.respond(items);
        }
        const req = await _sharpify.Sharpify.api.v1.checkout.order.getOrder({
            orderId: focused.value.toString()
        });
        if (!req.success) {
            if (req.errorName === "OrderNotFoundError") {
                return interaction.respond([]);
            }
            return interaction.respond([
                {
                    name: `Error ao buscar a compra: ${req.errorName}`,
                    value: "0"
                }
            ]);
        }
        return interaction.respond([
            {
                name: `#${req.data.order.shortReference} | total: ${(0, _lib.formatPrice)(req.data.order.pricing.total)}`,
                value: req.data.order.id
            }
        ]);
    }
};
OrderAutocompleteInterceptor = _ts_decorate([
    (0, _common.Injectable)()
], OrderAutocompleteInterceptor);

//# sourceMappingURL=auto-complete-order.interceptor.js.map