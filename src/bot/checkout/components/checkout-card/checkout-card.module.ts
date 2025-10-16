import { Global, Module } from "@nestjs/common";
import { HandleChannelClicked } from "./events";
import { CartEmmbedComponent } from "./components/cart-emmbed";
import { CheckoutCardComponent } from "./checkout-card";
import { SectionManagerHandler } from "./section-manager";
import { SelectCartItemComponent } from "./components/select-cart-item";
import { GoBackToMainSectionButionComponent } from "./components/go-back-to-main-section-button";
import { RemoveFromCartButtonComponent } from "./components/remove-from-cart-button";

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
		RemoveFromCartButtonComponent
	],
	exports: [CheckoutCardComponent, CartEmmbedComponent, SectionManagerHandler],
})
export class CheckoutCardModule {}
