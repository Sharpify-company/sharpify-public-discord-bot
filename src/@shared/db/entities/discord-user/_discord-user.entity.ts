export class DiscordUserEntity {
	id!: string;
	cartChannelId!: string | null;
	cartMessageId!: string | null;
	cartItems!: DiscordUserEntity.CartItem[];

	constructor(props: DiscordUserEntity.Props) {
		Object.assign(this, props);
	}

	static createFromDatabase(row: DiscordUserEntity.Props): DiscordUserEntity {
		return new DiscordUserEntity({
			id: row.id,
			cartChannelId: row.cartChannelId,
			cartMessageId: row.cartMessageId,
			cartItems: row.cartItems || [],
		});
	}

	static create(props: DiscordUserEntity.Input) {
		const defaultProps: DiscordUserEntity.Props = {
			...props,
			cartChannelId: null,
			cartMessageId: null,
			cartItems: [],
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
	};
}
