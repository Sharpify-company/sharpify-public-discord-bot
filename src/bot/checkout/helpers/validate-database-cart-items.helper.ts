import { ProductEntity } from "@/@shared/db/entities";
import { getDiscordUserRepository, getProductRepository } from "@/@shared/db/repositories";
import { Either } from "@/@shared/lib";
import { Sharpify } from "@/@shared/sharpify";

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

	const subTotal = user.cartItems.reduce((acc, item) => {
		const product = productEntities.find((p) => p.id === item.productId);
		if (!product) return acc;
		const productItem =
			product.productProps.settings.viewType === "NORMAL"
				? product.productProps.normalItem
				: product.productProps.dynamicItems.find((v) => v.id === item.productItemId);
		if (!productItem) return acc;
		return acc + productItem.pricing.price * item.quantity;
	}, 0);
	let total = subTotal;

	if (user.couponCode) {
		const couponReq = await Sharpify.api.v1.pricing.coupon.validateCoupon({ code: user.couponCode });
		if(!couponReq.success) {
			user.couponCode = null;
		}else {
			const coupon = couponReq.data.coupon;
			if(coupon.type === "PERCENTAGE") {
				total = total - (total * coupon.amout) / 100;
			}
			if(coupon.type === "FIXED") {
				total = total - coupon.amout;
				if(total < 0) total = 0;
			}
		}
	}

	user.subTotalPrice = subTotal;
	user.totalPrice = total;

	await discordUserRepository.update(user);
}
