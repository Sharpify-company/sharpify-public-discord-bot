import { StoreProps } from "@/@shared/sharpify/api";

export class DiscordUserEntity {
	id!: string;
	cartChannelId!: string | null;
	cartMessageId!: string | null;
	cartItems!: DiscordUserEntity.CartItem[];

	couponCode!: string | null;
	subTotalPrice!: number;
	totalPrice!: number;

	firstName!: string | null;
	lastName!: string | null;
	email!: string | null;

	gatewayMethod!: StoreProps.GatewayMethodsEnum | null;

	constructor(props: DiscordUserEntity.Props) {
		Object.assign(this, props);
	}

	static createFromDatabase(row: DiscordUserEntity.Props): DiscordUserEntity {
		return new DiscordUserEntity({
			id: row.id,
			cartChannelId: row.cartChannelId,
			cartMessageId: row.cartMessageId,
			cartItems: row.cartItems || [],
			couponCode: row.couponCode || null,
			subTotalPrice: row.subTotalPrice || 0,
			totalPrice: row.totalPrice || 0,
			firstName: row.firstName || null,
			lastName: row.lastName || null,
			email: row.email || null,
			gatewayMethod: row.gatewayMethod || null,
		});
	}

	static create(props: DiscordUserEntity.Input) {
		const defaultProps: DiscordUserEntity.Props = {
			...props,
			cartChannelId: null,
			cartMessageId: null,
			cartItems: [],
			couponCode: null,
			subTotalPrice: 0,
			totalPrice: 0,
			firstName: null,
			lastName: null,
			email: null,
			gatewayMethod: null,
		};
		return new DiscordUserEntity(defaultProps);
	}

	addToCart(item: DiscordUserEntity.CartItem) {
		const existingItemIndex = this.cartItems.findIndex(
			(cartItem) => cartItem.productId === item.productId && cartItem.productItemId === item.productItemId,
		);
		if (existingItemIndex === -1) {
			this.cartItems.push(item);
		}
	}

	removeFromCart({ productId, productItemId }: { productId: string; productItemId: string }) {
		this.cartItems = this.cartItems.filter(
			(cartItem) => !(cartItem.productId === productId && cartItem.productItemId === productItemId),
		);
	}

	cancelOrder() {
		this.cartItems = [];
		this.cartChannelId = null;
		this.cartMessageId = null;
		this.couponCode = null;
		this.subTotalPrice = 0;
		this.totalPrice = 0;
		this.gatewayMethod = null;
	}

	clearOrderData() {
		this.cartItems = [];
		this.cartChannelId = null;
		this.cartMessageId = null;
		this.couponCode = null;
		this.subTotalPrice = 0;
		this.totalPrice = 0;
		this.gatewayMethod = null;
	}
}

export namespace DiscordUserEntity {
	export type CartItem = {
		productId: string;
		productItemId: string;
		quantity: number;
	};

	export type Input = {
		id: string;
	};

	export type Props = {
		id: string;
		cartChannelId: string | null;
		cartMessageId: string | null;
		cartItems: CartItem[];

		couponCode: string | null;
		subTotalPrice: number;
		totalPrice: number;

		firstName: string | null;
		lastName: string | null;
		email: string | null;

		gatewayMethod: StoreProps.GatewayMethodsEnum | null;
	};
}
