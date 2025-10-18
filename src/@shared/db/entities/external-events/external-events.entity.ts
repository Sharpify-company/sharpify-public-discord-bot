import { ExternalEventsProps, ProductProps } from "@/@shared/sharpify/api";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("externalEvents")
export class ExternalEventsEntity extends BaseEntity {
	@PrimaryColumn({ name: "id", type: "text" })
	id!: string;

	@Column({ name: "eventName", type: "text" })
	eventName!: ExternalEventsProps.EventNameEnum;

	@Column({ name: "contextAggregateId", type: "text" })
	contextAggregateId!: string;

	@Column({ name: "payload", type: "json" })
	payload!: any;

	constructor() {
		super();
	}

	static createExternalEvent(props: ExternalEventsEntity.Input) {
		const defaultProps: ExternalEventsEntity.Props = {
			...props,
		};
		const entity = new ExternalEventsEntity();
		Object.assign(entity, defaultProps);
		return entity;
	}
}

export namespace ExternalEventsEntity {
	export type Input = {
		id: string;
		eventName: ExternalEventsProps.EventNameEnum;
		contextAggregateId: string;
		payload: any;
	};

	export type Props = {
		id: string;
		eventName: ExternalEventsProps.EventNameEnum;
		contextAggregateId: string;
		payload: any;
	};
}
