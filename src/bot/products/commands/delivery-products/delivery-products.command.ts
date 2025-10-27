import { Injectable, Logger, UseInterceptors } from "@nestjs/common";
import { EmbedBuilder, Integration, User } from "discord.js";
import { Context, Options, SlashCommand, SlashCommandContext, StringOption, UserOption, NumberOption } from "necord";
import { ProductAutocompleteInterceptor } from "./auto-complete-product.interceptor";
import { Sharpify } from "@/@shared/sharpify";
import { BotConfig } from "@/config";
import TurndownService from "turndown";
import { formatPrice } from "@/@shared/lib";
import { FindEmojiHelper } from "@/@shared/helpers";

const turndownService = new TurndownService();

export class InputDto {
	@StringOption({
		name: "titulo",
		description: "Título do produto",
		required: true,
		max_length: 100,
		autocomplete: true,
	})
	productIdAndItemId!: string;

	@UserOption({
		name: "usuario",
		description: "Usuário que receberá o produto",
		required: true,
	})
	user!: User;

	@NumberOption({
		name: "quantidade",
		description: "Quantidade de produtos a serem entregues",
		required: true,
		min_value: 1,
		max_value: 100,
	})
	quantity!: number;
}

@Injectable()
export class ListProductsCommand {
	constructor() {}

	@UseInterceptors(ProductAutocompleteInterceptor)
	@SlashCommand({
		name: "entregar-produto",
		description: "[📦] Entregue um produto sem a necessidade de uma compra.",
		defaultMemberPermissions: ["Administrator"],
	})
	public async onListProducts(
		@Context() [interaction]: SlashCommandContext,
		@Options() { productIdAndItemId, user, quantity }: InputDto,
	) {
		const [productId, productItemId] = productIdAndItemId.split(":");

		const productReq = await Sharpify.api.v1.catalog.product.get({
			id: productId,
		});

		if (!productReq.success) {
			return interaction.reply({
				content: `Error ao buscar produto: ${productReq.errorName}`,
				flags: ["Ephemeral"],
			});
		}

		const StockReq = await Sharpify.api.v1.catalog.product.decreseStock({
			productId,
			productItemId,
			quantity,
		});

		if (!StockReq.success) {
			let errorMessage = StockReq.errorName;
			if (StockReq.errorName === "InsufficientStockError") {
				errorMessage = `Estoque insuficiente para entregar ${quantity} unidade(s) deste produto.`;
			}
			return interaction.reply({
				content: `Error ao buscar produto: ${errorMessage}`,
				flags: ["Ephemeral"],
			});
		}

		const staticStock = StockReq.data.type === "STATIC" ? StockReq.data.stock : "Sem stoque";
		const lineStocks = StockReq.data.type === "LINES" ? JSON.parse(StockReq.data.stock || "[]") : [];

    const boxIcon = await FindEmojiHelper({  client: interaction.client, name: "Sharpify_caixa" })
    const cartIcon = await FindEmojiHelper({  client: interaction.client, name: "Sharpify_carrinho" })

		const product = productReq.data.product;
		const productEmbed = new EmbedBuilder()
			.setTitle(`${boxIcon} **Produto entregue por um administrador!**`)
			.setDescription(`🎉 Você recebeu alguns produtos do admistrador ${interaction.user}`)
			.setColor(BotConfig.color)
			.addFields({
				name: `${boxIcon} Produto:`,
				value: `\`\`${product.settings.viewType === "NORMAL" ? product.info.title : `${product.info.title} -> ${product.dynamicItems.find((item) => item.id === productItemId)?.info.title || "Sem nome"}`}\`\``,
				inline: true,
			})
			.addFields({
				name: `${cartIcon} Quantidade:`,
				value: `\`\`${quantity} unidades\`\``,
				inline: true,
			});

		const deliveryEmbed = new EmbedBuilder()
			.setTitle(`${boxIcon} **Entrega do produto: ${quantity} de ${quantity}**`)
			.setColor(BotConfig.color);

		if (StockReq.data.type === "STATIC") {
			deliveryEmbed.addFields({ name: `Estoque:`, value: `\`\`${staticStock}\`\`` });
		} else if (StockReq.data.type === "LINES") {
			deliveryEmbed.addFields({
				name: `Estoques:`,
				value: lineStocks.map((lineStock: string) => `\`\`${lineStock}\`\``).join("\n"),
			});
		}
		try {
			const dm = await user.createDM().catch(() => null);
			await dm?.send({
				content: `Olá ${user}! 👋\nUm administrador entregou estoque para você!`,
				embeds: [productEmbed, deliveryEmbed],
			});
			return interaction.reply({
				content: `Estoque entregue com sucesso para o usuário ${user}. \n Veja a mensagem enviada:`,
				embeds: [productEmbed, deliveryEmbed],
				components: [],
				flags: ["Ephemeral"],
			});
		} catch (error) {
			return interaction.reply({
				content: `Estoque foi removido do estoque. Mas não foi possível enviar a mensagem direta ao usuário. `,
			});
		}
	}
}
