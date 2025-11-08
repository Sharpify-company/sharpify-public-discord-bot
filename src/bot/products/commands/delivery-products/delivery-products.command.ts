import { Injectable, Logger, UseInterceptors } from "@nestjs/common";
import { AttachmentBuilder, EmbedBuilder, Integration, User } from "discord.js";
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
			includeNonListed: true,
		});

		if (!productReq.success) {
			return interaction.reply({
				content: `Error ao buscar produto: ${productReq.errorName}`,
				flags: ["Ephemeral"],
			});
		}

		await interaction.deferReply({ flags: ["Ephemeral"] });

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
			return interaction.editReply({
				content: `Error ao buscar produto: ${errorMessage}`,
			});
		}

		const staticStock = StockReq.data.type === "STATIC" ? StockReq.data.stock : "Sem stoque";
		const lineStocks = StockReq.data.type === "LINES" ? JSON.parse(StockReq.data.stock || "[]") : [];

		const boxIcon = await FindEmojiHelper({ client: interaction.client, name: "Sharpify_caixa" });
		const cartIcon = await FindEmojiHelper({ client: interaction.client, name: "Sharpify_carrinho" });

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

		let fileAttachment: AttachmentBuilder | null = null;

		if (StockReq.data.type === "STATIC") {
			if (staticStock.length > 1024) {
				// cria um arquivo temporário com o conteúdo do estoque
				const fileContent = `Estoque:\n${staticStock}`;
				fileAttachment = new AttachmentBuilder(Buffer.from(fileContent), {
					name: "estoque.txt",
				});
				deliveryEmbed.addFields({
					name: "Estoque:",
					value: "📄 Estoque muito grande — veja o arquivo `estoque.txt` em anexo.",
				});
			} else {
				deliveryEmbed.addFields({ name: `Estoque:`, value: `\`\`${staticStock}\`\`` });
			}
		} else if (StockReq.data.type === "LINES") {
			const joined = lineStocks.map((lineStock: string) => `\`\`${lineStock}\`\``).join("\n");
			if (joined.length > 1024) {
				const fileContent = `Estoques:\n${joined}`;
				fileAttachment = new AttachmentBuilder(Buffer.from(fileContent), {
					name: "estoques.txt",
				});
				deliveryEmbed.addFields({
					name: "Estoques:",
					value: "📄 Lista muito grande — veja o arquivo `estoques.txt` em anexo.",
				});
			} else {
				deliveryEmbed.addFields({ name: "Estoques:", value: joined });
			}
		}

		try {
			const dm = await user.createDM().catch(() => null);
			await dm?.send({
				content: `Olá ${user}! 👋\nUm administrador entregou estoque para você!`,
				embeds: [productEmbed, deliveryEmbed],
				files: fileAttachment ? [fileAttachment] : [],
			});
			return interaction.editReply({
				content: `Estoque entregue com sucesso para o usuário ${user}. \n Veja a mensagem enviada:`,
				embeds: [productEmbed, deliveryEmbed],
				components: [],
				files: fileAttachment ? [fileAttachment] : [],
			});
		} catch (error) {
			return interaction.editReply({
				content: `Estoque foi removido do estoque. Mas não foi possível enviar a mensagem direta ao usuário. `,
			});
		}
	}
}
