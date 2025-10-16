import { ExternalEventsProps, ProductProps } from "@/@shared/sharpify/api";

export class ExternalEventsEntity {
	id!: string;
	eventName!: ExternalEventsProps.EventNameEnum;
	contextAggregateId!: string;
    payload!: any;

	constructor(props: ExternalEventsEntity.Props) {
		Object.assign(this, props);
	}

	static createFromDatabase(row: ExternalEventsEntity.Props): ExternalEventsEntity {
		return new ExternalEventsEntity({
			id: row.id,
            eventName: row.eventName,
            contextAggregateId: row.contextAggregateId,
            payload: row.payload,
        });
	}

	static create(props: ExternalEventsEntity.Input) {
		const defaultProps: ExternalEventsEntity.Props = {
			...props,
		};
		return new ExternalEventsEntity(defaultProps);
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
