import { StoreProps } from "@/@shared/sharpify/api";
import { AfterLoad, BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { CartEmbedded } from "./cart.embedded";
import { PersonalInfoEmbedded } from "./personal-info.embedded";

@Entity("discordUsers")
export class DiscordUserEntity extends BaseEntity {
	@PrimaryColumn({ name: "id", type: "text" })
	id!: string;

	@Column(() => CartEmbedded, { prefix: false })
	cart!: CartEmbedded;

	@Column(() => PersonalInfoEmbedded, { prefix: false })
	personalInfo!: PersonalInfoEmbedded;

	constructor() {
		super();
	}

	static createUser(props: DiscordUserEntity.Input) {
		const defaultProps: DiscordUserEntity.Props = {
			...props,
			cart: CartEmbedded.createDefault(),
			personalInfo: PersonalInfoEmbedded.createDefault(),
		};
		const entity = new DiscordUserEntity();
		Object.assign(entity, defaultProps);
		entity.afterLoad();
	}

	@AfterLoad()
	private afterLoad() {
		this.cart.discordUser = this;
		this.personalInfo.discordUser = this;
	}
}

export namespace DiscordUserEntity {
	export type Input = {
		id: string;
	};

	export type Props = {
		id: string;
		cart: CartEmbedded;
		personalInfo: PersonalInfoEmbedded;
	};
}
