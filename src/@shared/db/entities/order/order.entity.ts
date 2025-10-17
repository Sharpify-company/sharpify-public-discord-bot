import { OrderProps } from "@/@shared/sharpify/api";

export class OrderEntity {
	id!: string;
	orderProps!: OrderProps;
	customerId!: string;
	deliveryStatus!: OrderEntity.DeliveryStatus;

	constructor(props: OrderEntity.Props) {
		Object.assign(this, props);
	}

	static create(props: OrderEntity.Input) {
		const defaultProps: OrderEntity.Props = {
			...props,
		};
		return new OrderEntity(defaultProps);
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
