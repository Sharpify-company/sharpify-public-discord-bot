"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ValidateDatabaseCartItemsHelper", {
    enumerable: true,
    get: function() {
        return ValidateDatabaseCartItemsHelper;
    }
});
const _entities = require("../../../@shared/db/entities");
const _sharpify = require("../../../@shared/sharpify");
async function ValidateDatabaseCartItemsHelper({ discordUserId }) {
    const user = await _entities.DiscordUserEntity.findOneBy({
        id: discordUserId
    });
    if (!user) return;
    const productIds = user.cart.cartItems.reduce((acc, item)=>{
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
    for (const cartItem of user.cart.cartItems){
        const product = productEntities.find((p)=>p.id === cartItem.productId);
        if (!product) {
            // Product no longer exists, remove from cart
            user.cart.removeFromCart({
                productId: cartItem.productId,
                productItemId: cartItem.productItemId
            });
            continue;
        }
        const productItem = product.productProps.settings.viewType === "NORMAL" ? product.productProps.normalItem : product.productProps.dynamicItems.find((v)=>v.id === cartItem.productItemId);
        if (!productItem) {
            // Product item no longer exists, remove from cart
            console.log("🚀 ~ ValidateDatabaseCartItemsHelper ~ productItem:", productItem);
            user.cart.removeFromCart({
                productId: cartItem.productId,
                productItemId: cartItem.productItemId
            });
            continue;
        }
        if (productItem.inventory.stockQuantity === null) continue;
        if (cartItem.quantity > productItem.inventory.stockQuantity) {
            // Adjust quantity to available stock
            cartItem.quantity = productItem.inventory.stockQuantity;
            if (cartItem.quantity <= 0) {
                user.cart.removeFromCart({
                    productId: cartItem.productId,
                    productItemId: cartItem.productItemId
                });
                continue;
            }
        }
    }
    const subTotal = user.cart.cartItems.reduce((acc, item)=>{
        const product = productEntities.find((p)=>p.id === item.productId);
        if (!product) return acc;
        const productItem = product.productProps.settings.viewType === "NORMAL" ? product.productProps.normalItem : product.productProps.dynamicItems.find((v)=>v.id === item.productItemId);
        if (!productItem) return acc;
        return acc + productItem.pricing.price * item.quantity;
    }, 0);
    let total = subTotal;
    if (user.cart.couponCode) {
        const couponReq = await _sharpify.Sharpify.api.v1.pricing.coupon.validateCoupon({
            code: user.cart.couponCode
        });
        if (!couponReq.success) {
            user.cart.couponCode = null;
        } else {
            const coupon = couponReq.data.coupon;
            if (coupon.type === "PERCENTAGE") {
                total = total - total * coupon.amout / 100;
            }
            if (coupon.type === "FIXED") {
                total = total - coupon.amout;
                if (total < 0) total = 0;
            }
        }
    }
    user.cart.subTotalPrice = subTotal;
    user.cart.totalPrice = total;
    await user.save();
}

//# sourceMappingURL=validate-database-cart-items.helper.js.map