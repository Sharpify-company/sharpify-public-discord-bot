import { formatPrice } from "@/@shared/lib";
import { Sharpify } from "@/@shared/sharpify";
import { Injectable } from "@nestjs/common";
import { AutocompleteInteraction } from "discord.js";
import { AutocompleteInterceptor } from "necord";

@Injectable()
export class OrderAutocompleteInterceptor extends AutocompleteInterceptor {
	public async transformOptions(interaction: AutocompleteInteraction) {
		const focused = interaction.options.getFocused(true);

		if (focused.name === "item") {
			const orderId = interaction.options.getString("venda");

			if (!orderId) {
				return interaction.respond([]);
			}

			const reqOrder = await Sharpify.api.v1.checkout.order.getOrder({
				orderId,
			});

			if (!reqOrder.success) {
				if (reqOrder.errorName === "OrderNotFoundError") {
					return interaction.respond([]);
				}
				return interaction.respond([
					{
						name: `Error ao buscar a compra: ${reqOrder.errorName}`,
						value: "0",
					},
				]);
			}

			const items = reqOrder.data.order.orderItems.map((item) => ({
				name: `${item.product.backup.viewType === "NORMAL" ? item.product.backup.title : `${item.product.backup.title} > ${item.product.itemBackup.title}`} (Qty: ${item.quantity})`,
				value: item.id,
			}));

			return interaction.respond(items);
		}

		const req = await Sharpify.api.v1.checkout.order.getOrder({
			orderId: focused.value.toString(),
		});

		if (!req.success) {
			if (req.errorName === "OrderNotFoundError") {
				return interaction.respond([]);
			}
			return interaction.respond([
				{
					name: `Error ao buscar a compra: ${req.errorName}`,
					value: "0",
				},
			]);
		}

		return interaction.respond([
			{
				name: `#${req.data.order.shortReference} | total: ${formatPrice(req.data.order.pricing.total)}`,
				value: req.data.order.id,
			},
		]);
	}
}
