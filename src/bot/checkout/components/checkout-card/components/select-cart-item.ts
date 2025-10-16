import { forwardRef, Inject, Injectable } from "@nestjs/common";
import {
	Modal,
	Context,
	SlashCommand,
	SlashCommandContext,
	Ctx,
	ModalContext,
	StringSelect,
	StringSelectContext,
	SelectedStrings,
} from "necord";
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
	StringSelectMenuBuilder,
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
import { ValidateDatabaseCartItemsHelper } from "../../../helpers";
import { formatCheckoutCartItemNameHelper, getCheckoutCartItemsHelper } from "../helper";
import { SectionManagerHandler } from "../section-manager";
import { WrapperType } from "@/@shared/types";

@Injectable()
export class SelectCartItemComponent {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => SectionManagerHandler))
		private readonly sectionManagerHandler: WrapperType<SectionManagerHandler>,
	) {}

	@StringSelect("cart_item_select")
	private async handleItemSelected(@Context() [interaction]: StringSelectContext, @SelectedStrings() selected: string[]) {
		const [productId, productItemId] = selected.at(0)?.split(":") as string[];

		const result = await this.sectionManagerHandler.setSection({
			discordUserId: interaction.user.id,
			section: "CART_ITEM",
			productId,
			itemId: productItemId,
		});

		await interaction.deferUpdate();
		await interaction.message.edit(result as any);
	}

	async createSelect({ discordUserId, defaultItemId }: { discordUserId: string; defaultItemId?: string }) {
		const discordUserRepository = await getDiscordUserRepository();
		await ValidateDatabaseCartItemsHelper({ discordUserId });

		const checkoutCartItems = await getCheckoutCartItemsHelper({ discordUserId });

		const options = checkoutCartItems.map((item) => ({
			label: formatCheckoutCartItemNameHelper(item).slice(0, 100),
			description: `💸 Valor: ${formatPrice(item.item.pricing.price)} | 📦 Estoque ${item.item.inventory.stockQuantity === null ? "Ilimitado" : `${item.item.inventory.stockQuantity} unidades`}`,
			value: `${item.product.id}:${item.item.id}`,
			emoji: "🛒",
			default: defaultItemId ? item.item.id === defaultItemId : false,
		}));

		const selectMenu = new StringSelectMenuBuilder()
			.setCustomId(`cart_item_select`)
			.setPlaceholder("Edite a quantidade ou remova o item do carrinho")
			.addOptions(options);

		const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

		return { row };
	}
}
