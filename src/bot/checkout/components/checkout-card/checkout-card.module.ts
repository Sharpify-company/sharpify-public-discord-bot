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
import { HandleOrderApprovedUsecase, HandleOrderCancelledUsecase } from "./usecases";
import { ViewOnWebsiteButtonComponent } from "./components/view-on-website";
import { OpenDmTutorialButtonComponent } from "./components/open-dm-tutorial-button";
import { HandleOrderApprovedUsecaseModuleModule } from "./usecases/handle-order-approved/handle-order-approved.module";

@Global()
@Module({
	imports: [HandleOrderApprovedUsecaseModuleModule],
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
		SelectPaymentMethodComponent,
		HandleOrderApprovedUsecase,
		HandleOrderCancelledUsecase,
		ViewOnWebsiteButtonComponent,
		OpenDmTutorialButtonComponent
	],
	exports: [CheckoutCardComponent, CartEmmbedComponent, SectionManagerHandler, HandleOrderApprovedUsecase, HandleOrderCancelledUsecase],
})
export class CheckoutCardModule {}
