"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "formatPrice", {
    enumerable: true,
    get: function() {
        return formatPrice;
    }
});
function formatPrice(amount, currency = 'BRL') {
    return amount.toLocaleString(undefined, {
        style: 'currency',
        currency
    });
}

//# sourceMappingURL=format.js.map