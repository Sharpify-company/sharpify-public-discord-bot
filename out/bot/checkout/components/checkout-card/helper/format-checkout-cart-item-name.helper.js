"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "formatCheckoutCartItemNameHelper", {
    enumerable: true,
    get: function() {
        return formatCheckoutCartItemNameHelper;
    }
});
function formatCheckoutCartItemNameHelper({ item, product }) {
    if (product.settings.viewType === "NORMAL") {
        return item.info.title;
    }
    return `${product.info.title} > ${item.info.title}`;
}

//# sourceMappingURL=format-checkout-cart-item-name.helper.js.map