import { Injectable, Logger, UseInterceptors } from "@nestjs/common";
import { EmbedBuilder, Integration } from "discord.js";
import { Context, Options, SlashCommand, SlashCommandContext, StringOption } from "necord";
import { ProductEmmbed } from "./components/_product-emmbed";
import { ProductAutocompleteInterceptor } from "./auto-complete-product.interceptor";
import { Sharpify } from "@/@shared/sharpify";
import { BotConfig } from "@/config";
import TurndownService from "turndown";
import { formatPrice } from "@/@shared/lib";
import { SelectSetProductOnChannel } from "./components/select-set-product-on-channel";
import { CreateConfigButtonComponent } from "./components/create-config-button";

const turndownService = new TurndownService();

export class InputDto {
	@StringOption({
		name: "titulo",
		description: "Título do produto",
		required: true,
		max_length: 100,
		autocomplete: true,
	})
	productId!: string;
}

@Injectable()
export class ListProductsCommand {
	constructor(
		private readonly productEmmbed: ProductEmmbed,
		private readonly selectSetProductOnChannel: SelectSetProductOnChannel,
		private readonly createConfigButtonComponent: CreateConfigButtonComponent,
	) {}

	@UseInterceptors(ProductAutocompleteInterceptor)
	@SlashCommand({
		name: "listar-produtos",
		description: "Cria um componente para listar os seus produtos da Sharpify!",
		defaultMemberPermissions: ["Administrator"],
	})
	public async onListProducts(@Context() [interaction]: SlashCommandContext, @Options() { productId }: InputDto) {
		const product = await Sharpify.api.v1.catalog.product.get({
			id: productId,
			includeNonListed: true
		});

		if (!product.success) {
			return interaction.reply({
				content: `Error ao buscar produto: ${product.errorName}`,
				flags: ["Ephemeral"],
			});
		}

		const { CreateProductConfigButton } = await this.createConfigButtonComponent.createButton({
			productId: product.data.product.id!,
		});
		return interaction.reply({
			embeds: [this.productEmmbed.createEmbbed(product.data.product)],
			components: [
        {
          type: 1,
          components: [CreateProductConfigButton],
        },
				this.selectSetProductOnChannel.createSelectChannel({
					interaction,
					product: product.data.product,
				}),
			],
			flags: ["Ephemeral"],
		});
	}
}
