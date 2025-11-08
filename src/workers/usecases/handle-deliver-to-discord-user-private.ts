import { ExternalEventsEntity, OrderEntity } from "@/@shared/db/entities";
import { formatPrice } from "@/@shared/lib";
import { getLocalStoreConfig } from "@/@shared/sharpify";
import { ProductProps } from "@/@shared/sharpify/api";
import { ProductCardComponent } from "@/bot/checkout/components";
import { BotConfig } from "@/config";
import { Inject, Injectable } from "@nestjs/common";
import {
	APIEmbedField,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonStyle,
	Client,
	EmbedBuilder,
	Message,
	MessageCreateOptions,
	TextChannel,
	User,
} from "discord.js";
import {} from "necord";

@Injectable()
export class HandleDeliverToDiscordUserPrivate {
	constructor(@Inject(Client) private readonly client: Client) {}

	async getUserDMChannelEmbed({ orderEntity, user }: { orderEntity: OrderEntity; user: User }): Promise<MessageCreateOptions> {
		const fields: APIEmbedField[] = [];

		const { url } = await getLocalStoreConfig();
		const ViewOnWebsiteButton = new ButtonBuilder()
			.setLabel("Visualizar compra no site") // text on the button
			.setStyle(ButtonStyle.Link) // gray button, like in the image
			.setEmoji("🔗")
			.setURL(`${url}/checkout/${orderEntity.id}`);

		let fileAttachments: AttachmentBuilder[] = [];
		for (const orderItem of orderEntity.orderProps.orderItems) {
			fields.push({
				name: `🛒 Produto:`,
				value: `\`\`\`${orderItem.product.backup.title} ${orderItem.product.backup.viewType === "DYNAMIC" ? `> ${orderItem.product.itemBackup.title}` : ""}\`\`\``,
			});
			fields.push({
				name: `Quantidade:`,
				value: `\`\`${orderItem.quantity}X\`\``,
				inline: true,
			});
			fields.push({
				name: `💵 Preço:`,
				value: `\`\`${formatPrice(orderItem.pricing.total)}\`\``,
				inline: true,
			});

			if (orderItem.product.itemBackup.stockType === "STATIC") {
				if ((orderItem.product?.itemBackup?.stockContent as string)?.length > 1024) {
					// cria um arquivo temporário com o conteúdo do estoque
					const fileContent = `Estoque:\n${orderItem.product?.itemBackup?.stockContent}`;
					fileAttachments.push(
						new AttachmentBuilder(Buffer.from(fileContent), {
							name: "estoque.txt",
						}),
					);
					fields.push({
						name: "Estoque:",
						value: "📄 Estoque muito grande — veja o arquivo `estoque.txt` em anexo.",
					});
				} else {
					fields.push({
						name: `Estoque:`,
						value: `\`\`\`${orderItem.product.itemBackup.stockContent}\`\`\``,
					});
				}
			} else if (orderItem.product.itemBackup.stockType === "LINES") {
				const joined = (orderItem.product.itemBackup.stockContent as any)
					.map((lineStock: string) => `\`\`\`${lineStock}\`\`\``)
					.join("\n");
				if (joined.length > 1024) {
					const fileContent = `Estoques:\n${joined}`;
					fileAttachments.push(
						new AttachmentBuilder(Buffer.from(fileContent), {
							name: "estoques.txt",
						}),
					);
					fields.push({
						name: "Estoques:",
						value: "📄 Lista muito grande — veja o arquivo `estoques.txt` em anexo.",
					});
				} else {
					fields.push({
						name: `Estoque:`,
						value: joined,
					});
				}
			}

			fields.push({ name: "\u200b", value: "" }); // Empty field for spacing
		}

		const embed = new EmbedBuilder()
			.setDescription("Detalhes do pedido...")
			.setColor(BotConfig.color)
			.addFields(fields)
			.setFooter({ text: "Obrigado por comprar conosco! ❤️" });

		return {
			content: `Olá ${user}! 👋\nSeu pedido #${orderEntity.orderProps.shortReference} foi entregue com sucesso!`,
			embeds: [embed],
			components: [{ type: 1, components: [ViewOnWebsiteButton] }],
			files: fileAttachments,
		};
	}

	async execute({ orderEntity }: { orderEntity: OrderEntity }) {
		// 1️⃣ Get the user by ID
		const user = await this.client.users.fetch(orderEntity.customerId).catch(() => null);
		if (!user) {
			console.warn(`User with ID ${orderEntity.customerId} not found.`);
			return;
		}

		const dm = await user.createDM();

		try {
			await dm.send(await this.getUserDMChannelEmbed({ orderEntity, user }));
		} catch (error: any) {
			if (error.code === 50007) {
				console.warn(`❌ Cannot send DM to user ${orderEntity.customerId}. DMs are closed.`);
				// Optionally: notify them in a public channel or log internally
			} else {
				console.error("Unexpected error sending DM:", error);
			}
			return;
		}

		await orderEntity.markAsDelivered();
	}
}
