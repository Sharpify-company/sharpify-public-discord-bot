import { StoreProps } from "@/@shared/sharpify/api";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("storeConfig")
export class StoreConfigEntity extends BaseEntity {
	@PrimaryColumn({ name: "id", type: "text" })
	id: string = "DEFAULT";

	@Column({ name: "name", type: "text", nullable: false })
	name!: string;

	@Column({ name: "description", type: "text", nullable: false })
	description!: string;

	@Column({ name: "url", type: "text", nullable: false })
	url!: string;

	@Column({ name: "image", type: "text", nullable: false })
	image!: string;

	@Column({ name: "gatewayMethods", type: "json", nullable: false, default: "[]" })
	gatewayMethods!: StoreProps.GatewayMethodsEnum[];

	constructor() {
		super();
	}

	static createStore(props: StoreProps) {
		const entity = new StoreConfigEntity();
        entity.updateStoreProps(props);
		return entity;
	}

	updateStoreProps(props: StoreProps) {
		this.name = props.info.name || "Sem nome";
		this.description = props.info.description || "Sem descrição";
		this.url = props.url || "https://example.com";
		this.image = props.info.image ?? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
		this.gatewayMethods = props.paymentConfigs.filter((pm) => pm.isEnabled).map((pm) => pm.gatewayMethod);
	}

    async updateProps(props: StoreProps) {
        this.updateStoreProps(props);
        await this.save();
    }

}

export namespace StoreConfigEntity {
	export type Props = {
		id: string;
		name: string;
		description: string;
		url: string;
		image: string;
		gatewayMethods: StoreProps.GatewayMethodsEnum[];
	};
}
