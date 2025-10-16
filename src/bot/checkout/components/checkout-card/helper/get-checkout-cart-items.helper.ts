import { getDiscordUserRepository, getProductRepository } from "@/@shared/db/repositories";
import { CheckoutCartItem } from "../types";
import { ProductEntity } from "@/@shared/db/entities";

export async function getCheckoutCartItemsHelper({ discordUserId }: { discordUserId: string }): Promise<CheckoutCartItem[]> {
	const discordUserRepository = await getDiscordUserRepository();
	const productRepository = await getProductRepository();

	const discordUserEntity = await discordUserRepository.findById(discordUserId);
	if (!discordUserEntity) return [];

	const checkoutCartItems: CheckoutCartItem[] = [];

	const productIds = discordUserEntity.cartItems.reduce((acc, item) => {
		if (!acc.includes(item.productId)) {
			acc.push(item.productId);
		}
		return acc;
	}, [] as string[]);

	const productEntities: ProductEntity[] = [];
	for (const productId of productIds) {
		const product = await productRepository.findById(productId);
		product && productEntities.push(product);
	}

	for (const cartItem of discordUserEntity.cartItems) {
		const productEntity = productEntities.find((p) => p.id === cartItem.productId);
		if (!productEntity) continue;
		const item =
			productEntity.productProps.settings.viewType === "NORMAL"
				? productEntity.productProps.normalItem
				: productEntity.productProps.dynamicItems.find((v) => v.id === cartItem.productItemId);
		if (!item) continue;
		checkoutCartItems.push({
			product: productEntity.productProps,
			item,
            quantity: cartItem.quantity,
		});
	}

	return checkoutCartItems;
}
