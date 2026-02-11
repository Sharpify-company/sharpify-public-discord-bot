import { StoreProps } from "@/@shared/sharpify/api";
import { AfterLoad, Column } from "typeorm";
import { DiscordUserEntity } from "./_discord-user.entity";

export class PersonalInfoEmbedded {
	discordUser!: DiscordUserEntity;

	@Column({ name: "personalInfo_firstName", type: "text", nullable: true })
	firstName!: string;

	@Column({ name: "personalInfo_lastName", type: "text", nullable: true })
	lastName!: string;

	@Column({ name: "personalInfo_email", type: "text", nullable: true })
	email!: string;

	constructor(props: PersonalInfoEmbedded.Props) {
		Object.assign(this, props);
	}

	static createDefault() {
		return new PersonalInfoEmbedded({
			firstName: null!,
			lastName: null!,
			email: null!,
		});
	}

	async updateInfo(props: { firstName: string; lastName: string; email: string }) {
		this.firstName = props.firstName;
		this.lastName = props.lastName;
		this.email = props.email;
		await this.discordUser.save();
	}
}

export namespace PersonalInfoEmbedded {
	export type CartItem = {
		productId: string;
		productItemId: string;
		quantity: number;
	};

	export type Props = {
		firstName: string | null;
		lastName: string | null;
		email: string | null;
	};
}
