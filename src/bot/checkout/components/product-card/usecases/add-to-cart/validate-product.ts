import { Either, failure, success } from "@/@shared/lib";
import { AddToCartUsecase } from "./_add-to-cart.usecase";
import { ProductProps } from "@/@shared/sharpify/api";
import { Sharpify } from "@/@shared/sharpify";
import { InteractionResponse } from "discord.js";

export async function ValidateProduct({
	interaction,
	productId,
	productItemId,
}: Parameters<typeof AddToCartUsecase.execute>[0]): Promise<Either<InteractionResponse, ProductProps>> {
	const req = await Sharpify.api.v1.catalog.product.get({
		id: productId,
	});

	if (!req.success) {
		return failure(
			await interaction.reply({
				content: `Error ao buscar produto: ${req.errorName}`,
				flags: ["Ephemeral"],
			}),
		);
	}

	const { product } = req.data;

	const productItem =
		product.settings.viewType === "NORMAL" ? product.normalItem : product.dynamicItems.find((v) => v.id === productItemId);

	if (!productItem) {
		return failure(
			await interaction.reply({
				content: `Item inválido.`,
				flags: ["Ephemeral"],
			}),
		);
	}

	if (productItem.inventory.stockQuantity === null) return success(product);
	if (productItem.inventory.stockQuantity <= 0) {
		return failure(
			await interaction.reply({
				content: `Item sem estoque.`,
				flags: ["Ephemeral"],
			}),
		);
	}

	return success(product);
}
