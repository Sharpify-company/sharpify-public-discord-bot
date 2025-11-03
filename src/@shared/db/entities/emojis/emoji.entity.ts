import Sharpify, { StoreProps } from "@/@shared/sharpify/api";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("Emojis")
export class EmojiEntity extends BaseEntity {
	@PrimaryColumn({ name: "id", type: "text" })
	id!: string;

	@Column({ name: "name", type: "text", nullable: false })
	name!: EmojiEntity.EmojiNameEnum;

	constructor() {
		super();
	}

	static createEmoji(props: EmojiEntity.Props) {
		const entity = new EmojiEntity();
		Object.assign(entity, props);
		return entity;
	}
}

export namespace EmojiEntity {
	export const EmojiNameEnum = {
		Sharpify_aceitar: "Sharpify_aceitar",
		Sharpify_ticket: "Sharpify_ticket",
		Sharpify_recusar: "Sharpify_recusar",
		Sharpify_pix: "Sharpify_pix",
		Sharpify_letsgo: "Sharpify_letsgo",
		Sharpify_money: "Sharpify_money",
		Sharpify_carrinho: "Sharpify_carrinho",
		Sharpify_carregando: "Sharpify_carregando",
		Sharpify_direita: "Sharpify_direita",
		Sharpify_caixa: "Sharpify_caixa",
		Sharpify_efibank: "Sharpify_efibank",
		Sharpify_dev: "Sharpify_dev",
	} as const;
	export type EmojiNameEnum = keyof typeof EmojiNameEnum;

	export type Props = {
		id: string;
		name: string;
	};
}
