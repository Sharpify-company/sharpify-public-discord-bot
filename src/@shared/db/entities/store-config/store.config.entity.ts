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

	@Column({ name: "paymentGateways", type: "json", nullable: false, default: "[]" })
	paymentGateways!: StoreProps.PaymentConfig[];

	@Column({ name: "applyRolesSettings", type: "json", nullable: false, default: "[]" })
	applyRolesSettings!: StoreConfigEntity.RoleSettings[];

	@Column({ name: "preferences", type: "json", nullable: false, default: "{}" })
	preferences!: StoreConfigEntity.Preferences;

	constructor() {
		super();
	}

	static createStore(props: StoreProps) {
		const entity = new StoreConfigEntity();
		entity.updateStoreProps(props);
		entity.applyRolesSettings = [];
		return entity;
	}

	updateStoreProps(props: StoreProps) {
		this.name = props.info.name || "Sem nome";
		this.description = props.info.description || "Sem descrição";
		this.url = props.url || "https://example.com";
		this.image = props.info.image ?? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
		this.paymentGateways = props.paymentConfigs || [];
	}

	async updateProps(props: StoreProps) {
		this.updateStoreProps(props);
		await this.save();
	}

	async updateRoleSettings(roleSettings: StoreConfigEntity.RoleSettings[]) {
		this.applyRolesSettings = roleSettings;
		await this.save();
	}

	getPreferences(): StoreConfigEntity.Preferences {
		return {
			...(this.preferences || {}),
			privateLogSales: this.preferences?.privateLogSales ?? {
				enabled: this.preferences?.privateLogSales?.enabled ?? false,
				onlyDiscordSales: this.preferences?.privateLogSales?.onlyDiscordSales ?? false,
			},
			publicLogSales: this.preferences?.publicLogSales ?? {
				enabled: this.preferences?.publicLogSales?.enabled ?? false,
				onlyDiscordSales: this.preferences?.publicLogSales?.onlyDiscordSales ?? false,
			},
			failLog: this.preferences?.failLog ?? {
				enabled: this.preferences?.failLog?.enabled ?? false,
			},
		};
	}

	async savePreferences(preferences: StoreConfigEntity.Preferences) {
		this.preferences = preferences;
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
		paymentGateways: StoreProps.PaymentConfig[];
		applyRolesSettings: RoleSettings[];
	};

	export type RoleSettings = {
		roleId: string;
	};

	export type Preferences = {
		privateLogSales: {
			enabled: boolean;
			channelId?: string;
			onlyDiscordSales?: boolean;
		};
		publicLogSales: {
			enabled: boolean;
			channelId?: string;
			onlyDiscordSales?: boolean;
		};
		failLog: {
			enabled: boolean;
			channelId?: string;
		};
	};
}
