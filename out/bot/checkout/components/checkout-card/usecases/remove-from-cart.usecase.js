"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RemoveFromCartUsecase", {
    enumerable: true,
    get: function() {
        return RemoveFromCartUsecase;
    }
});
const _entities = require("../../../../../@shared/db/entities");
let RemoveFromCartUsecase = class RemoveFromCartUsecase {
    static async execute({ discordUserId, productId, productItemId }) {
        const userEntity = await _entities.DiscordUserEntity.findOneBy({
            id: discordUserId
        });
        if (!userEntity) return {
            cartIsEmpty: true
        };
        await userEntity.cart.removeFromCart({
            productId,
            productItemId
        });
        return {
            cartIsEmpty: userEntity.cart.isCartEmpty()
        };
    }
};

//# sourceMappingURL=remove-from-cart.usecase.js.map