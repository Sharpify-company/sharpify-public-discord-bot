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
import { DiscordUserEntity, EmojiEntity, ProductEntity } from "@/@shared/db/entities";
import { ValidateDatabaseCartItemsHelper } from "../../../helpers";
import { formatCheckoutCartItemNameHelper, getCheckoutCartItemsHelper } from "../helper";
import { SectionManagerHandler } from "../section-manager";
import { WrapperType } from "@/@shared/types";
import { getLocalStoreConfig, Sharpify } from "@/@shared/sharpify";
import { FindEmojiHelper } from "@/@shared/helpers";

@Injectable()
export class SelectPaymentMethodComponent {
	constructor(
		@Inject(Client) private readonly client: Client,
		@Inject(forwardRef(() => SectionManagerHandler))
		private readonly sectionManagerHandler: WrapperType<SectionManagerHandler>,
	) {}

	@StringSelect("gateway_method_selected")
	private async handleItemSelected(@Context() [interaction]: StringSelectContext, @SelectedStrings() selected: string[]) {
		const discordUser = await DiscordUserEntity.findOneBy({ id: interaction.user.id });
		if (discordUser) {
			discordUser.cart.gatewayMethod = selected[0]! as any;
			await discordUser.save();
		}

		const result = await this.sectionManagerHandler.setSection({
			discordUserId: interaction.user.id,
			section: "MAIN",
		});

		await interaction.deferUpdate();
		await interaction.message.edit(result as any);
	}

	async createSelect({ discordUserId }: { discordUserId: string }) {
		const discordUser = await DiscordUserEntity.findOneBy({ id: discordUserId });

		const storeConfig = await getLocalStoreConfig();

		const defaultGatewayMethod = discordUser?.cart.gatewayMethod || storeConfig.paymentGateways.at(0)?.gatewayMethod || null;

		if (discordUser && defaultGatewayMethod) {
			discordUser.cart.gatewayMethod = defaultGatewayMethod;
			discordUser.save();
		}
		const pixEmoji = await FindEmojiHelper({ client: this.client, name: "Sharpify_pix" });

		const options = storeConfig.paymentGateways.map((item, index) => {
			const result: any = {
				label: "Método de pagamento PIX",
				description: `Pague via PIX utilizando nosso gerenciador de pagamentos.`,
				value: item.gatewayMethod,
				default: defaultGatewayMethod === item.gatewayMethod,
			};
			if (item.gatewayMethod === "PIX" && pixEmoji) {
				result.emoji = { id: pixEmoji.id };
			}
			return result;
		});

		const selectMenu = new StringSelectMenuBuilder()
			.setCustomId(`gateway_method_selected`)
			.setPlaceholder("Selecione o método de pagamento")
			.addOptions(options);

		const selectPaymentMethod = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

		return { selectPaymentMethod };
	}
}
