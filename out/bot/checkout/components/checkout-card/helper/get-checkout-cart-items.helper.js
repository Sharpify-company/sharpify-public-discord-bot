"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getCheckoutCartItemsHelper", {
    enumerable: true,
    get: function() {
        return getCheckoutCartItemsHelper;
    }
});
const _entities = require("../../../../../@shared/db/entities");
async function getCheckoutCartItemsHelper({ discordUserId }) {
    const discordUserEntity = await _entities.DiscordUserEntity.findOneBy({
        id: discordUserId
    });
    if (!discordUserEntity) return [];
    const checkoutCartItems = [];
    const productIds = discordUserEntity.cart.cartItems.reduce((acc, item)=>{
        if (!acc.includes(item.productId)) {
            acc.push(item.productId);
        }
        return acc;
    }, []);
    const productEntities = [];
    for (const productId of productIds){
        const product = await _entities.ProductEntity.findOneBy({
            id: productId
        });
        product && productEntities.push(product);
    }
    for (const cartItem of discordUserEntity.cart.cartItems){
        const productEntity = productEntities.find((p)=>p.id === cartItem.productId);
        if (!productEntity) continue;
        const item = productEntity.productProps.settings.viewType === "NORMAL" ? productEntity.productProps.normalItem : productEntity.productProps.dynamicItems.find((v)=>v.id === cartItem.productItemId);
        if (!item) continue;
        checkoutCartItems.push({
            product: productEntity.productProps,
            item,
            quantity: cartItem.quantity
        });
    }
    return checkoutCartItems;
}

//# sourceMappingURL=get-checkout-cart-items.helper.js.map