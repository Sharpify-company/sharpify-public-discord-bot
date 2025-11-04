"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddToCartUsecase", {
    enumerable: true,
    get: function() {
        return AddToCartUsecase;
    }
});
const _validateproduct = require("./validate-product");
const _ensurecartchannelcreated = require("./ensure-cart-channel-created");
const _ensureuserexistsondb = require("./ensure-user-exists-on-db");
const _checkoutcard = require("../../../checkout-card/checkout-card");
const _createreplytogotocheckout = require("./create-reply-to-go-to-checkout");
const _helpers = require("../../../../helpers");
const _common = require("@nestjs/common");
const _entities = require("../../../../../../@shared/db/entities");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AddToCartUsecase = class AddToCartUsecase {
    async execute(input) {
        const { interaction } = input;
        if (!await _entities.ProductEntity.existsBy({
            id: input.productId
        })) {
            return interaction.reply({
                content: "❌ Produto não encontrado ou indisponível.",
                flags: [
                    "Ephemeral"
                ]
            });
        }
        const validateProductResult = await (0, _validateproduct.ValidateProduct)(input);
        if (validateProductResult.isFailure()) return;
        const product = validateProductResult.value;
        const ensureUserCreatedResult = await (0, _ensureuserexistsondb.EnsureUserExistsOnDb)(input);
        if (ensureUserCreatedResult.isFailure()) return;
        const user = ensureUserCreatedResult.value;
        user.cart.addToCart({
            productId: product.id,
            productItemId: input.productItemId,
            quantity: 1
        });
        await user.save();
        const ensureCartResult = await (0, _ensurecartchannelcreated.EnsureCartChannelCreated)({
            ...input,
            user
        });
        if (ensureCartResult.isFailure()) return;
        const { channel, same: sameChannel } = ensureCartResult.value;
        await (0, _createreplytogotocheckout.CreateReplyToGoToCheckout)({
            ...input,
            channel
        });
        if (!sameChannel) {
            const checkoutReply = await this.checkoutCardComponent.sendCheckoutCardToChannel({
                channel,
                discordUser: user
            });
            user.cart.messageId = checkoutReply.id;
        } else {
            await this.checkoutCardComponent.editCheckoutCardToChannel({
                channel,
                discordUser: user,
                messageId: user.cart.messageId
            });
        }
        user.cart.channelId = channel.id;
        await user.save();
        await (0, _helpers.ValidateDatabaseCartItemsHelper)({
            discordUserId: user.id
        });
    }
    constructor(checkoutCardComponent){
        this.checkoutCardComponent = checkoutCardComponent;
    }
};
AddToCartUsecase = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _checkoutcard.CheckoutCardComponent === "undefined" ? Object : _checkoutcard.CheckoutCardComponent
    ])
], AddToCartUsecase);

//# sourceMappingURL=_add-to-cart.usecase.js.map