import { ProductProps } from "@/@shared/sharpify/api";

export type CheckoutCartItem = {
	product: ProductProps;
	item: ProductProps.ProductItem;
	quantity: number;
};
