import { Global, Module } from "@nestjs/common";
import { HandleChannelClicked } from "./events";
import { CartEmmbedComponent } from "./components/cart-emmbed";
import { CheckoutCardComponent } from "./checkout-card";
import { SectionManagerHandler } from "./section-manager";
import { SelectCartItemComponent } from "./components/select-cart-item";
import { GoBackToMainSectionButionComponent } from "./components/go-back-to-main-section-button";
import { RemoveFromCartButtonComponent } from "./components/remove-from-cart-button";
import { UpdateQuantityButtonComponent } from "./components/update-quantity-button";
import { CancelOrderButtonComponent } from "./components/cancell-order-button";
import { ApplyCouponButtonComponent } from "./components/apply-coupon-button";
import { PlaceOrderButtonComponent } from "./components/place-order-button";
import { SelectPaymentMethodComponent } from "./components/select-payment-method";

@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [
		HandleChannelClicked,
		CheckoutCardComponent,
		CartEmmbedComponent,
		SectionManagerHandler,
		SelectCartItemComponent,
		GoBackToMainSectionButionComponent,
		RemoveFromCartButtonComponent,
		UpdateQuantityButtonComponent,
		CancelOrderButtonComponent,
		ApplyCouponButtonComponent,
		PlaceOrderButtonComponent,
		SelectPaymentMethodComponent
	],
	exports: [CheckoutCardComponent, CartEmmbedComponent, SectionManagerHandler],
})
export class CheckoutCardModule {}
