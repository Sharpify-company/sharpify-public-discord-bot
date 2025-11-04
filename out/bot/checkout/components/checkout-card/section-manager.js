"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SectionManagerHandler", {
    enumerable: true,
    get: function() {
        return SectionManagerHandler;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
const _config = require("../../../../config");
const _cartemmbed = require("./components/cart-emmbed");
const _selectcartitem = require("./components/select-cart-item");
const _gobacktomainsectionbutton = require("./components/go-back-to-main-section-button");
const _removefromcartbutton = require("./components/remove-from-cart-button");
const _updatequantitybutton = require("./components/update-quantity-button");
const _cancellorderbutton = require("./components/cancell-order-button");
const _applycouponbutton = require("./components/apply-coupon-button");
const _placeorderbutton = require("./components/place-order-button");
const _selectpaymentmethod = require("./components/select-payment-method");
const _viewonwebsite = require("./components/view-on-website");
const _opendmtutorialbutton = require("./components/open-dm-tutorial-button");
const _helpers = require("../../../../@shared/helpers");
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
let SectionManagerHandler = class SectionManagerHandler {
    async setSection({ discordUserId, ...props }) {
        if (props.section === "MAIN") {
            const { emmbed } = await this.cartEmmbedComponent.makeCartEmmbed({
                discordUserId
            });
            const { row } = await this.selectCartItemComponent.createSelect({
                discordUserId
            });
            const { CancelCartButton } = await this.cancelOrderButtonComponent.createButton();
            const { ApplyCouponButton } = await this.applyCouponButtonComponent.createButton({
                discordUserId
            });
            const { selectPaymentMethod } = await this.selectPaymentMethodComponent.createSelect({
                discordUserId
            });
            const { PlaceOrderButton } = await this.placeOrderButtonComponent.createButton({
                discordUserId
            });
            return {
                embeds: [
                    emmbed
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            PlaceOrderButton,
                            ApplyCouponButton,
                            CancelCartButton
                        ]
                    },
                    selectPaymentMethod,
                    row
                ],
                options: {
                    withResponse: true
                }
            };
        } else if (props.section === "CART_ITEM") {
            const { emmbed } = await this.cartEmmbedComponent.makeSingleCartItemEmmbed({
                discordUserId,
                productId: props.productId,
                itemId: props.itemId
            });
            const { row } = await this.selectCartItemComponent.createSelect({
                discordUserId,
                defaultItemId: props.itemId
            });
            const { backToSummaryButton } = await this.goBackToMainSectionButionComponent.createButton();
            const { removeFromCartButton } = await this.removeFromCartButtonComponent.createButton({
                productId: props.productId,
                productItemId: props.itemId
            });
            const { UpdateQuantityCartButton } = await this.updateQuantityButtonComponent.createButton({
                productId: props.productId,
                productItemId: props.itemId
            });
            return {
                embeds: [
                    emmbed
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            UpdateQuantityCartButton,
                            removeFromCartButton
                        ]
                    },
                    row,
                    {
                        type: 1,
                        components: [
                            backToSummaryButton
                        ]
                    }
                ],
                options: {
                    withResponse: true
                }
            };
        }
        const steps = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle(`Passos para finalizar o pedido`).setDescription(`
			\`\`\`
✅ 1. Lembre-se de abrir a sua DM antes de pagar.
--------------------------
✅ 2. Realize o pagamento via Pix utilizando o código copia e cola ou o QR Code abaixo.
--------------------------
✅ 3. Após o pagamento, seu pedido será processado automaticamente.
--------------------------
✅ 4. Assim que o pagamento for confirmado, você receberá seus produtos aqui na sua DM.
			\`\`\`
				`);
        const { emmbed } = await this.cartEmmbedComponent.makeCartEmmbed({
            discordUserId
        });
        const { CancelCartButton } = await this.cancelOrderButtonComponent.createButton();
        const { ViewOnWebsiteButton } = await this.viewOnWebsiteButtonComponent.createButton({
            orderId: props.orderEntity.id
        });
        const { OpenDmTutorialButton } = await this.openDmTutorialButtonComponent.createButton();
        if (props.orderEntity.orderProps.payment.gateway.data.hasQrCode) {
            const qrCode = props.orderEntity.orderProps.payment.gateway.data.qrCode;
            const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");
            const attachment = new _discord.AttachmentBuilder(Buffer.from(base64Data, "base64"), {
                name: "qrcode.png"
            });
            const qrUrl = `attachment://qrcode.png`;
            const Pixemmbed = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle(`Pagamento via Pix`).setDescription(`Para pagar via Pix, utilize o código abaixo no seu aplicativo bancário:`).addFields({
                name: "🔑 **Código copia e cola**",
                value: `\`\`\`${props.orderEntity.orderProps.payment.gateway.data.code}\`\`\``
            }).setImage(qrUrl);
            return {
                embeds: [
                    steps,
                    Pixemmbed
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            ViewOnWebsiteButton,
                            OpenDmTutorialButton,
                            CancelCartButton
                        ]
                    }
                ],
                files: [
                    attachment
                ]
            };
        }
        const cartEmoji = await (0, _helpers.FindEmojiHelper)({
            client: this.client,
            name: "Sharpify_carrinho"
        });
        const PayButton = new _discord.ButtonBuilder().setLabel("Pagar agora").setStyle(_discord.ButtonStyle.Link).setURL(props.orderEntity.orderProps.payment.gateway.data.paymentLink).setEmoji({
            id: cartEmoji?.id
        });
        const ExternalLinkEmmbed = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle(`Pagamento via pagamento externo`).setDescription(`Accesse o link externo para pagar:`);
        return {
            embeds: [
                steps,
                ExternalLinkEmmbed
            ],
            components: [
                {
                    type: 1,
                    components: [
                        ViewOnWebsiteButton,
                        PayButton,
                        OpenDmTutorialButton,
                        CancelCartButton
                    ]
                }
            ],
            files: []
        };
    }
    constructor(client, cartEmmbedComponent, selectCartItemComponent, goBackToMainSectionButionComponent, removeFromCartButtonComponent, updateQuantityButtonComponent, cancelOrderButtonComponent, applyCouponButtonComponent, placeOrderButtonComponent, selectPaymentMethodComponent, viewOnWebsiteButtonComponent, openDmTutorialButtonComponent){
        this.client = client;
        this.cartEmmbedComponent = cartEmmbedComponent;
        this.selectCartItemComponent = selectCartItemComponent;
        this.goBackToMainSectionButionComponent = goBackToMainSectionButionComponent;
        this.removeFromCartButtonComponent = removeFromCartButtonComponent;
        this.updateQuantityButtonComponent = updateQuantityButtonComponent;
        this.cancelOrderButtonComponent = cancelOrderButtonComponent;
        this.applyCouponButtonComponent = applyCouponButtonComponent;
        this.placeOrderButtonComponent = placeOrderButtonComponent;
        this.selectPaymentMethodComponent = selectPaymentMethodComponent;
        this.viewOnWebsiteButtonComponent = viewOnWebsiteButtonComponent;
        this.openDmTutorialButtonComponent = openDmTutorialButtonComponent;
    }
};
SectionManagerHandler = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _cartemmbed.CartEmmbedComponent === "undefined" ? Object : _cartemmbed.CartEmmbedComponent,
        typeof _selectcartitem.SelectCartItemComponent === "undefined" ? Object : _selectcartitem.SelectCartItemComponent,
        typeof _gobacktomainsectionbutton.GoBackToMainSectionButionComponent === "undefined" ? Object : _gobacktomainsectionbutton.GoBackToMainSectionButionComponent,
        typeof _removefromcartbutton.RemoveFromCartButtonComponent === "undefined" ? Object : _removefromcartbutton.RemoveFromCartButtonComponent,
        typeof _updatequantitybutton.UpdateQuantityButtonComponent === "undefined" ? Object : _updatequantitybutton.UpdateQuantityButtonComponent,
        typeof _cancellorderbutton.CancelOrderButtonComponent === "undefined" ? Object : _cancellorderbutton.CancelOrderButtonComponent,
        typeof _applycouponbutton.ApplyCouponButtonComponent === "undefined" ? Object : _applycouponbutton.ApplyCouponButtonComponent,
        typeof _placeorderbutton.PlaceOrderButtonComponent === "undefined" ? Object : _placeorderbutton.PlaceOrderButtonComponent,
        typeof _selectpaymentmethod.SelectPaymentMethodComponent === "undefined" ? Object : _selectpaymentmethod.SelectPaymentMethodComponent,
        typeof _viewonwebsite.ViewOnWebsiteButtonComponent === "undefined" ? Object : _viewonwebsite.ViewOnWebsiteButtonComponent,
        typeof _opendmtutorialbutton.OpenDmTutorialButtonComponent === "undefined" ? Object : _opendmtutorialbutton.OpenDmTutorialButtonComponent
    ])
], SectionManagerHandler);

//# sourceMappingURL=section-manager.js.map