"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CheckoutCardModule", {
    enumerable: true,
    get: function() {
        return CheckoutCardModule;
    }
});
const _common = require("@nestjs/common");
const _events = require("./events");
const _cartemmbed = require("./components/cart-emmbed");
const _checkoutcard = require("./checkout-card");
const _sectionmanager = require("./section-manager");
const _selectcartitem = require("./components/select-cart-item");
const _gobacktomainsectionbutton = require("./components/go-back-to-main-section-button");
const _removefromcartbutton = require("./components/remove-from-cart-button");
const _updatequantitybutton = require("./components/update-quantity-button");
const _cancellorderbutton = require("./components/cancell-order-button");
const _applycouponbutton = require("./components/apply-coupon-button");
const _placeorderbutton = require("./components/place-order-button");
const _selectpaymentmethod = require("./components/select-payment-method");
const _usecases = require("./usecases");
const _viewonwebsite = require("./components/view-on-website");
const _opendmtutorialbutton = require("./components/open-dm-tutorial-button");
const _handleorderapprovedmodule = require("./usecases/handle-order-approved/handle-order-approved.module");
const _handleorderfeedbacksentmodule = require("./usecases/handle-order-feedback-sent/handle-order-feedback-sent.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CheckoutCardModule = class CheckoutCardModule {
};
CheckoutCardModule = _ts_decorate([
    (0, _common.Global)(),
    (0, _common.Module)({
        imports: [
            _handleorderapprovedmodule.HandleOrderApprovedUsecaseModuleModule,
            _handleorderfeedbacksentmodule.HandleOrderFeedbackSentModule
        ],
        controllers: [],
        providers: [
            _events.HandleChannelClicked,
            _checkoutcard.CheckoutCardComponent,
            _cartemmbed.CartEmmbedComponent,
            _sectionmanager.SectionManagerHandler,
            _selectcartitem.SelectCartItemComponent,
            _gobacktomainsectionbutton.GoBackToMainSectionButionComponent,
            _removefromcartbutton.RemoveFromCartButtonComponent,
            _updatequantitybutton.UpdateQuantityButtonComponent,
            _cancellorderbutton.CancelOrderButtonComponent,
            _applycouponbutton.ApplyCouponButtonComponent,
            _placeorderbutton.PlaceOrderButtonComponent,
            _selectpaymentmethod.SelectPaymentMethodComponent,
            _usecases.HandleOrderApprovedUsecase,
            _usecases.HandleOrderCancelledUsecase,
            _viewonwebsite.ViewOnWebsiteButtonComponent,
            _opendmtutorialbutton.OpenDmTutorialButtonComponent
        ],
        exports: [
            _checkoutcard.CheckoutCardComponent,
            _cartemmbed.CartEmmbedComponent,
            _sectionmanager.SectionManagerHandler,
            _usecases.HandleOrderApprovedUsecase,
            _usecases.HandleOrderCancelledUsecase
        ]
    })
], CheckoutCardModule);

//# sourceMappingURL=checkout-card.module.js.map