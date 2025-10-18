import { OrderProps } from "@/@shared/sharpify/api";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("orders")
export class OrderEntity extends BaseEntity {
	@PrimaryColumn({ name: "id", type: "text" })
	id!: string;

	@Column({ name: "orderProps", type: "json" })
	orderProps!: OrderProps;

	@Column({ name: "customerId", type: "text" })
	customerId!: string;

	@Column({ name: "deliveryStatus", type: "text" })
	deliveryStatus!: OrderEntity.DeliveryStatus;

	constructor() {
		super();
	}

	static createOrder(props: OrderEntity.Input) {
		const defaultProps: OrderEntity.Props = {
			...props,
		};
		const entity = new OrderEntity();
		Object.assign(entity, defaultProps);
		return entity;
	}

	async markAsDelivered() {
		this.deliveryStatus = "DELIVERED";
		await this.save();
	}

	async markAsPreparingDelivery() {
		this.deliveryStatus = "PREPARING_DELIVERY";
		await this.save();
	}

	async updateOrderProps(props: OrderProps) {
		this.orderProps = props;
		await this.save();
	}
}

export namespace OrderEntity {
	export const DeliveryStatus = {
		PENDING: "PENDING",
		PREPARING_DELIVERY: "PREPARING_DELIVERY",
		DELIVERED: "DELIVERED",
	} as const;
	export type DeliveryStatus = keyof typeof DeliveryStatus;

	export type Input = {
		id: string;
		orderProps: OrderProps;
		customerId: string;
		deliveryStatus: OrderEntity.DeliveryStatus;
	};

	export type Props = {
		id: string;
		orderProps: OrderProps;
		customerId: string;
		deliveryStatus: OrderEntity.DeliveryStatus;
	};
}
