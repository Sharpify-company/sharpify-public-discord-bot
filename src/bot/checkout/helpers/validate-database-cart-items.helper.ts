import { DiscordUserEntity, ProductEntity } from "@/@shared/db/entities";
import { Either } from "@/@shared/lib";
import { Sharpify } from "@/@shared/sharpify";
import { ProductProps } from "@/@shared/sharpify/api";

function findProductItemFromProduct({ product, productItemId }: { productItemId: string; product: ProductEntity }) {
	return product.productProps.settings.viewType === "NORMAL"
		? product.productProps.normalItem.id === productItemId
			? product.productProps.normalItem
			: undefined
		: product.productProps.dynamicItems.find((v) => v.id === productItemId);
}

export async function ValidateDatabaseCartItemsHelper({ discordUserId }: { discordUserId: string }) {
	const user = await DiscordUserEntity.findOneBy({ id: discordUserId });
	if (!user) return;

	const productIds = user.cart.cartItems.reduce((acc, item) => {
		if (!acc.includes(item.productId)) {
			acc.push(item.productId);
		}
		return acc;
	}, [] as string[]);

	const productEntities: ProductEntity[] = [];
	for (const productId of productIds) {
		const product = await ProductEntity.findOneBy({ id: productId });
		product && productEntities.push(product);
	}

	const couponReq = user.cart.couponCode
		? await Sharpify.api.v1.pricing.coupon.validateCoupon({ code: user.cart.couponCode })
		: null;
	const coupon = couponReq?.success ? couponReq.data.coupon : null;
	const allProductsWithCouponApplied = productEntities.filter((product) =>
		coupon?.useCondition?.productIds?.includes(product.id),
	);
	if (coupon && coupon.useCondition?.productIds && allProductsWithCouponApplied.length === 0) {
		// Coupon no longer valid for any products in cart, remove it
		user.cart.couponCode = null;
	}

	let fixedDiscountPerProduct = 0;
	let fixedDiscountRemainder = 0;
	if (coupon?.type === "FIXED" && allProductsWithCouponApplied.length > 0) {
		fixedDiscountPerProduct = coupon?.amout / allProductsWithCouponApplied.length;
		if (fixedDiscountPerProduct < 0.01) fixedDiscountPerProduct = 0;
	}

	for (const cartItem of user.cart.cartItems) {
		const isCouponApplied = !!allProductsWithCouponApplied.find((p) => p.id === cartItem.productId);

		const product = productEntities.find((p) => p.id === cartItem.productId);
		if (!product) {
			// Product no longer exists, remove from cart
			user.cart.removeFromCart({ productId: cartItem.productId, productItemId: cartItem.productItemId });
			continue;
		}

		const productItem = findProductItemFromProduct({ product, productItemId: cartItem.productItemId });

		if (!productItem) {
			// Product item no longer exists, remove from cart
			console.log("🚀 ~ ValidateDatabaseCartItemsHelper ~ productItem:", productItem);
			user.cart.removeFromCart({ productId: cartItem.productId, productItemId: cartItem.productItemId });
			continue;
		}

		if (productItem.inventory.stockQuantity !== null && cartItem.quantity > productItem.inventory.stockQuantity) {
			// Adjust quantity to available stock
			cartItem.quantity = productItem.inventory.stockQuantity;
			if (cartItem.quantity <= 0) {
				user.cart.removeFromCart({ productId: cartItem.productId, productItemId: cartItem.productItemId });
				continue;
			}
		}
		cartItem.subTotalPrice = productItem.pricing.price * cartItem.quantity;
		cartItem.totalPrice = cartItem.subTotalPrice;

		const subTotal = productItem.pricing.price * cartItem.quantity;
		let total = subTotal;
		let discountAmount = 0;

		if (coupon && isCouponApplied) {
			if (coupon.type === "PERCENTAGE") {
				discountAmount = (total * coupon.amout) / 100;
				total = total - discountAmount;
			} else if (coupon.type === "FIXED") {
				discountAmount = fixedDiscountPerProduct;
				total = total - discountAmount - fixedDiscountRemainder;
				fixedDiscountRemainder = 0;

				if (total < 0) {
					fixedDiscountRemainder += Math.abs(total);
					total = 0;
				}
			}
		}

		cartItem.totalPrice = total;
		cartItem.subTotalPrice = subTotal;
		cartItem.isCouponApplied = isCouponApplied;
	}

	const subTotal = user.cart.cartItems.reduce((acc, item) => acc + item.subTotalPrice, 0);
	const total = user.cart.cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

	user.cart.subTotalPrice = subTotal;
	user.cart.totalPrice = total;

	await user.save();
}
