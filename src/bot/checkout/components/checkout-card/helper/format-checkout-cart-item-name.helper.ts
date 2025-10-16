import { CheckoutCartItem } from "../types";

export function formatCheckoutCartItemNameHelper({ item, product }: CheckoutCartItem): string {
	if (product.settings.viewType === "NORMAL") {
		return item.info.title;
	}
	return `${product.info.title} > ${item.info.title}`;
}
