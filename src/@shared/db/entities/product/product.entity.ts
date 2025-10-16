import { ProductProps } from "@/@shared/sharpify/api";

export class ProductEntity {
	id!: string;
	productProps!: ProductProps;
	channelsLinked!: ProductEntity.ChannelsLinked[];

	constructor(props: ProductEntity.Props) {
		Object.assign(this, props);
	}

	static createFromDatabase(row: ProductEntity.Props): ProductEntity {
		return new ProductEntity({
			id: row.id,
			productProps: row.productProps,
			channelsLinked: row.channelsLinked,
		});
	}

	static create(props: ProductEntity.Input) {
		const defaultProps: ProductEntity.Props = {
			...props,
			channelsLinked: props.channelsLinked || [],
		};
		return new ProductEntity(defaultProps);
	}

	setChannelLinked({ channelId, messageId }: { channelId: string; messageId: string }) {
		const existing = this.channelsLinked.find((c) => c.channelId === channelId);
		if (existing) {
			existing.messageId = messageId;
		} else {
			this.channelsLinked.push({ channelId, messageId });
		}
	}
}

export namespace ProductEntity {
	export type ChannelsLinked = {
		channelId: string;
		messageId: string;
	};

	export type Input = {
		id: string;
		productProps: ProductProps;
		channelsLinked?: ProductEntity.ChannelsLinked[];
	};

	export type Props = {
		id: string;
		productProps: ProductProps;
		channelsLinked: ProductEntity.ChannelsLinked[];
	};
}
