import { Global, Module } from "@nestjs/common";
import { ProductCardComponent } from "./product-card";
import { AddToCartButtonComponent } from "./components/add-to-cart-button";
import { AddToCartEvent } from "./events";
import { AddToCartUsecase } from "./usecases";
import { CheckoutCardComponent } from "../checkout-card/checkout-card";

@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [ProductCardComponent, AddToCartButtonComponent, AddToCartEvent, AddToCartUsecase, CheckoutCardComponent],
	exports: [AddToCartButtonComponent, ProductCardComponent],
})
export class ProductCardModule {}
