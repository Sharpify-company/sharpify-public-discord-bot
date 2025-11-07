import { FindEmojiHelper } from "@/@shared/helpers";
import { formatPrice } from "@/@shared/lib";
import { Sharpify } from "@/@shared/sharpify";
import { ProductProps } from "@/@shared/sharpify/api";
import { ConsoleLogger, Injectable } from "@nestjs/common";
import { AutocompleteInteraction } from "discord.js";
import { AutocompleteInterceptor } from "necord";

@Injectable()
export class ProductAutocompleteInterceptor extends AutocompleteInterceptor {
	public async transformOptions(interaction: AutocompleteInteraction) {
		const focused = interaction.options.getFocused(true);

		if (focused.name !== "titulo") return;

		const req = await Sharpify.api.v1.catalog.product.list({
			limit: 10,
			page: 1,
			title: focused.value.toString(),
			productItemTitle: focused.value.toString(),
		});
		if (!req.success)
			return interaction.respond([
				{
					name: `Error ao buscar produtos: ${req.errorName}`,
					value: "0",
				},
			]);

		const productItems: { product: ProductProps; item: ProductProps.ProductItem }[] = [];

		for (const product of req.data.products) {
			if (product.settings.viewType === "NORMAL") {
				productItems.push({ product, item: product.normalItem });
			} else {
				productItems.push(...product.dynamicItems.map((item) => ({ product, item })));
			}
		}

		return interaction.respond(
			productItems
				.filter(({ item, product }) => {
					return (
						product.info.title?.toLowerCase()?.includes(focused.value.toString().toLowerCase()) ||
						item.info.title?.toLowerCase()?.includes(focused.value.toString().toLowerCase())
					);
				})
				.map(({ item, product }) => {
					let title =
						product.settings.viewType === "NORMAL"
							? product.info.title
							: `${product.info.title} ➡️ ${item.info.title}`;
					return {
						name: `${title.slice(0, 50)}  |  ${formatPrice(item.pricing.price)} | 📦 ${item.inventory.stockQuantity === null ? "Estoque ilimitado" : `${item.inventory.stockQuantity} em estoque`}`,
						value: `${product.id}:${item.id}`,
					};
				}),
		);
	}
}
