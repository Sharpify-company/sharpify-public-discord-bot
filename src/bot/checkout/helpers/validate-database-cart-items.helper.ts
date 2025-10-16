import { ProductEntity } from "@/@shared/db/entities";
import { getDiscordUserRepository, getProductRepository } from "@/@shared/db/repositories";

export async function ValidateDatabaseCartItemsHelper({ discordUserId }: { discordUserId: string }) {
	const discordUserRepository = await getDiscordUserRepository();
	const productRepository = await getProductRepository();

	const user = await discordUserRepository.findById(discordUserId);
	if (!user) return;

	const productIds = user.cartItems.reduce((acc, item) => {
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

	for (const cartItem of user.cartItems) {
		const product = productEntities.find((p) => p.id === cartItem.productId);
		if (!product) {
			// Product no longer exists, remove from cart
			user.removeFromCart({ productId: cartItem.productId, productItemId: cartItem.productItemId });
			continue;
		}

		const productItem =
			product.productProps.settings.viewType === "NORMAL"
				? product.productProps.normalItem
				: product.productProps.dynamicItems.find((v) => v.id === cartItem.productItemId);

		if (!productItem) {
			// Product item no longer exists, remove from cart
			user.removeFromCart({ productId: cartItem.productId, productItemId: cartItem.productItemId });
			continue;
		}

		if (productItem.inventory.stockQuantity === null) continue;
		if (cartItem.quantity > productItem.inventory.stockQuantity) {
			// Adjust quantity to available stock
			cartItem.quantity = productItem.inventory.stockQuantity;
			if (cartItem.quantity <= 0) {
				user.removeFromCart({ productId: cartItem.productId, productItemId: cartItem.productItemId });
				continue;
			}
		}
	}
	await discordUserRepository.update(user);
}
