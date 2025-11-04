"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ValidateProduct", {
    enumerable: true,
    get: function() {
        return ValidateProduct;
    }
});
const _lib = require("../../../../../../@shared/lib");
const _sharpify = require("../../../../../../@shared/sharpify");
async function ValidateProduct({ interaction, productId, productItemId }) {
    const req = await _sharpify.Sharpify.api.v1.catalog.product.get({
        id: productId,
        includeNonListed: true
    });
    if (!req.success) {
        return (0, _lib.failure)(await interaction.reply({
            content: `Error ao buscar produto: ${req.errorName}`,
            flags: [
                "Ephemeral"
            ]
        }));
    }
    const { product } = req.data;
    const productItem = product.settings.viewType === "NORMAL" ? product.normalItem : product.dynamicItems.find((v)=>v.id === productItemId);
    if (!productItem) {
        return (0, _lib.failure)(await interaction.reply({
            content: `Item inválido.`,
            flags: [
                "Ephemeral"
            ]
        }));
    }
    if (productItem.inventory.stockQuantity === null) return (0, _lib.success)(product);
    if (productItem.inventory.stockQuantity <= 0) {
        return (0, _lib.failure)(await interaction.reply({
            content: `Item sem estoque.`,
            flags: [
                "Ephemeral"
            ]
        }));
    }
    return (0, _lib.success)(product);
}

//# sourceMappingURL=validate-product.js.map