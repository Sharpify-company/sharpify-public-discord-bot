import { Inject, Injectable } from "@nestjs/common";
import { Modal, Context, SlashCommand, SlashCommandContext, Ctx, ModalContext } from "necord";
import {
	ActionRowBuilder,
	CacheType,
	ChatInputCommandInteraction,
	Client,
	EmbedBuilder,
	Message,
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
import { getDiscordUserRepository, getProductRepository } from "@/@shared/db/repositories";
import { ValidateDatabaseCartItemsHelper } from "../../helpers";
import { formatCheckoutCartItemNameHelper, getCheckoutCartItemsHelper } from "./helper";
import { CartEmmbedComponent } from "./components/cart-emmbed";
import { SectionManagerHandler } from "./section-manager";

@Injectable()
export class CheckoutCardComponent {
	constructor(
		@Inject(Client) private readonly client: Client,
		private readonly sectionManagerHandler: SectionManagerHandler,
	) {}

	async sendCheckoutCardToChannel({
		channel,
		discordUser,
	}: {
		discordUser: DiscordUserEntity;
		channel: TextChannel;
	}): Promise<Message<true>> {
		const result = await this.sectionManagerHandler.setSection({ discordUserId: discordUser.id, section: "MAIN" });
		return channel.send(result);
	}

	async editCheckoutCardToChannel({
		channel,
		discordUser,
		messageId,
	}: {
		discordUser: DiscordUserEntity;
		channel: TextChannel;
		messageId: string;
	}) {
		const result = await this.sectionManagerHandler.setSection({ discordUserId: discordUser.id, section: "MAIN" });

		const message = await channel.messages.fetch(messageId).catch(() => null);
		await message?.edit(result as any);
	}
}
