import { ProductProps } from "@/@shared/sharpify/api";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("products")
export class ProductEntity extends BaseEntity {
	@PrimaryColumn({ name: "id", type: "text" })
	id!: string;

	@Column({ name: "orderProps", type: "json" })
	productProps!: ProductProps;

	@Column({ name: "channelsLinked", type: "json" })
	channelsLinked!: ProductEntity.ChannelsLinked[];

	constructor() {
		super();
	}

	static createProduct(props: ProductEntity.Input) {
		const defaultProps: ProductEntity.Props = {
			...props,
			channelsLinked: props.channelsLinked || [],
		};
		const entity = new ProductEntity();
		Object.assign(entity, defaultProps);
		return entity;
	}

	async updateProps(props: ProductProps) {
		this.productProps = props;
		await this.save();
	}

	async setChannelLinked({ channelId, messageId }: { channelId: string; messageId: string }) {
		const existing = this.channelsLinked.find((c) => c.channelId === channelId);
		if (existing) {
			existing.messageId = messageId;
		} else {
			this.channelsLinked.push({ channelId, messageId });
		}
		this.save();
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
