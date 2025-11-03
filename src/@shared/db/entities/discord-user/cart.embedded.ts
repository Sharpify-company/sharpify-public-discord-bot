import { StoreProps } from "@/@shared/sharpify/api";
import { AfterLoad, Column } from "typeorm";
import { DiscordUserEntity } from "./_discord-user.entity";

export class CartEmbedded {
	discordUser!: DiscordUserEntity;

	@Column({ name: "cart_channelId", type: "text", nullable: true })
	channelId!: string;

	@Column({ name: "cart_messageId", type: "text", nullable: true })
	messageId!: string;

	@Column({ name: "cart_items", type: "json", nullable: false, default: "[]" })
	cartItems!: CartEmbedded.CartItem[];

	@Column({ name: "cart_ gatewayMethod", type: "text", nullable: true })
	gatewayMethod!: StoreProps.GatewayMethodsEnum | null;

	@Column({ name: "cart_couponCode", type: "text", nullable: true })
	couponCode!: string | null;

	@Column({ name: "cart_subTotalPrice", type: "real", nullable: false, default: 0 })
	subTotalPrice!: number;

	@Column({ name: "cart_totalPrice", type: "real", nullable: false, default: 0 })
	totalPrice!: number;

	@Column({ name: "cart_createdAt", type: "datetime", nullable: true })
	cartCreatedAt!: Date;

	@Column({ name: "cart_isOpened", type: "boolean", nullable: false, default: 0 })
	isOpened!: boolean;

	constructor(props: CartEmbedded.Props) {
		Object.assign(this, props);
	}

	static createDefault() {
		return new CartEmbedded({
			channelId: null!,
			messageId: null!,
			cartItems: [],
			couponCode: null!,
			subTotalPrice: 0,
			totalPrice: 0,
			cartCreatedAt: null!,
			gatewayMethod: null!,
			isOpened: false,
		});
	}

	addToCart(item: CartEmbedded.CartItem) {
		const existingItemIndex = this.cartItems.findIndex(
			(cartItem) => cartItem.productId === item.productId && cartItem.productItemId === item.productItemId,
		);
		if (existingItemIndex === -1) {
			this.cartItems.push(item);
		}

		if (!this.isOpened && this.cartItems.length > 0) {
			this.isOpened = true;
			this.cartCreatedAt = new Date();
		}
	}

	async removeFromCart({ productId, productItemId }: { productId: string; productItemId: string }) {
		this.cartItems = this.cartItems.filter(
			(cartItem) => !(cartItem.productId === productId && cartItem.productItemId === productItemId),
		);

		if (this.isCartEmpty()) {
			this.isOpened = false;
			this.cartCreatedAt = null!;
		}
		await this.discordUser.save();
	}

	async cancelOrder() {
		this.cartItems = [];
		this.channelId = null!;
		this.messageId = null!;
		this.couponCode = null;
		this.subTotalPrice = 0;
		this.totalPrice = 0;
		this.cartCreatedAt = null!;
        this.isOpened = false;

		await this.discordUser.save();
	}

	async updateGatewayMethod(gatewayMethod: StoreProps.GatewayMethodsEnum) {
		this.gatewayMethod = gatewayMethod;
		await this.discordUser.save();
	}

	@AfterLoad()
	private afterLoad() {
		this.isOpened = Boolean(this.isOpened);
		// this.cartItems = Array.isArray(this.cartItems) ? this.cartItems : JSON.parse(this.cartItems as unknown as string);
	}

	isCartEmpty() {
		return this.cartItems.length === 0;
	}
}

export namespace CartEmbedded {
	export type CartItem = {
		productId: string;
		productItemId: string;
		quantity: number;
	};

	export type Props = {
		channelId: string;
		messageId: string | null;
		cartItems: CartItem[];
		couponCode: string | null;
		subTotalPrice: number;
		totalPrice: number;
		cartCreatedAt: Date | null;
		gatewayMethod: StoreProps.GatewayMethodsEnum | null;
		isOpened: boolean;
	};
}
