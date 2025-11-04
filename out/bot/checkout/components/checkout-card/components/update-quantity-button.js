"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpdateQuantityButtonComponent", {
    enumerable: true,
    get: function() {
        return UpdateQuantityButtonComponent;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _entities = require("../../../../../@shared/db/entities");
const _helper = require("../helper");
const _sectionmanager = require("../section-manager");
const _types = require("../../../../../@shared/types");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let UpdateQuantityButtonComponent = class UpdateQuantityButtonComponent {
    async onModalSubmit([interaction], productIdAndItemId) {
        const discordUser = await _entities.DiscordUserEntity.findOneBy({
            id: interaction.user.id
        });
        if (!discordUser) {
            await interaction.reply({
                content: "Usuário não encontrado. Por favor, inicie uma compra primeiro.",
                flags: [
                    "Ephemeral"
                ]
            });
            return;
        }
        const quantity = parseInt(interaction.fields.getTextInputValue("quantityInput"));
        if (isNaN(quantity) || quantity < 1) {
            await interaction.reply({
                content: "Quantidade inválida. Por favor, insira um número válido maior que 0.",
                flags: [
                    "Ephemeral"
                ]
            });
            return;
        }
        const [productId, productItemId] = productIdAndItemId.split(":");
        const productItems = await (0, _helper.getCheckoutCartItemsHelper)({
            discordUserId: interaction.user.id
        });
        const cartItem = productItems.find((v)=>v.product.id === productId && v.item.id === productItemId);
        if (!cartItem) {
            await interaction.reply({
                content: "Item não encontrado no carrinho.",
                flags: [
                    "Ephemeral"
                ]
            });
            return;
        }
        if (cartItem.item.inventory.stockQuantity !== null && quantity > cartItem.item.inventory.stockQuantity) {
            await interaction.reply({
                content: `Quantidade inválida. A quantidade máxima disponível em estoque é ${cartItem.item.inventory.stockQuantity}.`,
                flags: [
                    "Ephemeral"
                ]
            });
            return;
        }
        discordUser.cart.cartItems = discordUser.cart.cartItems.map((v)=>{
            if (v.productId === productId && v.productItemId === productItemId) {
                v.quantity = quantity;
            }
            return v;
        });
        await discordUser.save();
        interaction.deferUpdate();
        const result = await this.sectionManagerHandler.setSection({
            discordUserId: interaction.user.id,
            section: "CART_ITEM",
            productId,
            itemId: productItemId
        });
        await interaction.message?.edit(result);
    }
    async handleButtonClicked([interaction], productIdAndItemId) {
        const [productId, productItemId] = productIdAndItemId.split(":");
        const productItems = await (0, _helper.getCheckoutCartItemsHelper)({
            discordUserId: interaction.user.id
        });
        const cartItem = productItems.find((v)=>v.product.id === productId && v.item.id === productItemId);
        if (!cartItem) {
            await interaction.reply({
                content: "Item não encontrado no carrinho.",
                flags: [
                    "Ephemeral"
                ]
            });
            return;
        }
        const modal = new _discord.ModalBuilder().setCustomId(`update_cart_quantity_modal/${productId}:${productItemId}`).setTitle(`Editar quantidade - ${(0, _helper.formatCheckoutCartItemNameHelper)(cartItem)}`.slice(0, 45));
        const quantityInput = new _discord.TextInputBuilder().setCustomId("quantityInput").setLabel(`Insira a nova quantidade. MAX ${cartItem.item.inventory.stockQuantity === null ? "Ilimitado" : cartItem.item.inventory.stockQuantity + " unidades"}`).setValue(String(cartItem.quantity)).setStyle(_discord.TextInputStyle.Short).setMinLength(1).setMaxLength(3).setRequired(true);
        modal.setComponents(new _discord.ActionRowBuilder().addComponents([
            quantityInput
        ]));
        await interaction.showModal(modal);
    }
    async createButton({ productId, productItemId }) {
        const UpdateQuantityCartButton = new _discord.ButtonBuilder().setCustomId(`update_quantity/${productId}:${productItemId}`) // unique ID to handle clicks
        .setLabel("Editar quantidade") // text on the button
        .setStyle(_discord.ButtonStyle.Success) // gray button, like in the image
        .setEmoji("📦");
        return {
            UpdateQuantityCartButton
        };
    }
    constructor(client, sectionManagerHandler){
        this.client = client;
        this.sectionManagerHandler = sectionManagerHandler;
    }
};
_ts_decorate([
    (0, _necord.Modal)("update_cart_quantity_modal/:productIdAndItemId"),
    _ts_param(0, (0, _necord.Ctx)()),
    _ts_param(1, (0, _necord.ModalParam)("productIdAndItemId")),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _necord.ModalContext === "undefined" ? Object : _necord.ModalContext,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UpdateQuantityButtonComponent.prototype, "onModalSubmit", null);
_ts_decorate([
    (0, _necord.Button)("update_quantity/:productIdAndItemId"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_param(1, (0, _necord.ComponentParam)("productIdAndItemId")),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UpdateQuantityButtonComponent.prototype, "handleButtonClicked", null);
UpdateQuantityButtonComponent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_sectionmanager.SectionManagerHandler))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType
    ])
], UpdateQuantityButtonComponent);

//# sourceMappingURL=update-quantity-button.js.map