import { Inject, Injectable } from "@nestjs/common";
import { Modal, Context, SlashCommand, SlashCommandContext, Ctx, ModalContext } from "necord";
import {
	ActionRowBuilder,
	CacheType,
	ChatInputCommandInteraction,
	Client,
	EmbedBuilder,
	Message,
	MessageCreateOptions,
	MessagePayload,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	ModalSubmitInteraction,
	TextChannel,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { BotConfig } from "@/config";
import { ProductProps } from "@/@shared/sharpify/api";
import { formatPrice } from "@/@shared/lib";
import TurndownService from "turndown";
import { DiscordUserEntity, ProductEntity } from "@/@shared/db/entities";
import { CartEmmbedComponent } from "./components/cart-emmbed";
import { SelectCartItemComponent } from "./components/select-cart-item";
import { GoBackToMainSectionButionComponent } from "./components/go-back-to-main-section-button";
import { RemoveFromCartButtonComponent } from "./components/remove-from-cart-button";
import { getDiscordUserRepository } from "@/@shared/db/repositories";

type SetSectionProps = {
	discordUserId: string;
	deleteChannelIfCartIsEmpty?: boolean;
} & (
	| {
			section: "MAIN";
	  }
	| {
			section: "CART_ITEM";
			productId: string;
			itemId: string;
	  }
);

@Injectable()
export class SectionManagerHandler {
	constructor(
		@Inject(Client) private readonly client: Client,
		private readonly cartEmmbedComponent: CartEmmbedComponent,
		private readonly selectCartItemComponent: SelectCartItemComponent,
		private readonly goBackToMainSectionButionComponent: GoBackToMainSectionButionComponent,
		private readonly removeFromCartButtonComponent: RemoveFromCartButtonComponent,
	) {}

	async setSection({ discordUserId, deleteChannelIfCartIsEmpty = true, ...props }: SetSectionProps): Promise<string | MessagePayload | MessageCreateOptions> {
		const discordUserRepository = await getDiscordUserRepository();

		// const discordUserEntity = await discordUserRepository.findById(discordUserId);
		// if (!discordUserEntity) return { embeds: [] };

		// if (deleteChannelIfCartIsEmpty && discordUserEntity.cartItems.length === 0) {
		// 	try {
		// 		const cartChannel = (await this.client.channels.fetch(discordUserEntity.cartChannelId ?? "")) as TextChannel;
		// 		if (!cartChannel) return { embeds: [] };

		// 		await cartChannel.delete();
		// 	} catch (err) {
		// 		console.log("🚀 ~ SectionManagerHandler ~ setSection ~ err:", err);
		// 		return { embeds: [] };
		// 	}
		// }

		if (props.section === "MAIN") {
			const { emmbed } = await this.cartEmmbedComponent.makeCartEmmbed({ discordUserId });
			const { row } = await this.selectCartItemComponent.createSelect({ discordUserId });

			return {
				embeds: [emmbed],
				components: [row],
				options: {
					withResponse: true,
				},
			};
		}

		const { emmbed } = await this.cartEmmbedComponent.makeSingleCartItemEmmbed({
			discordUserId,
			productId: props.productId,
			itemId: props.itemId,
		});
		const { row } = await this.selectCartItemComponent.createSelect({ discordUserId, defaultItemId: props.itemId });
		const { backToSummaryButton } = await this.goBackToMainSectionButionComponent.createButton();
		const { removeFromCartButton } = await this.removeFromCartButtonComponent.createButton({
			productId: props.productId,
			productItemId: props.itemId,
		});

		return {
			embeds: [emmbed],
			components: [{ type: 1, components: [removeFromCartButton] }, row, { type: 1, components: [backToSummaryButton] }],
			options: {
				withResponse: true,
			},
		};
	}
}
