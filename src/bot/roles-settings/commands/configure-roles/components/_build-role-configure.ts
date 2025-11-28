import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Modal, Context, SlashCommand, SlashCommandContext, Ctx, ModalContext } from "necord";
import {
	ActionRowBuilder,
	CacheType,
	ChatInputCommandInteraction,
	Client,
	EmbedBuilder,
	InteractionReplyOptions,
	InteractionResponse,
	MessagePayload,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	ModalSubmitInteraction,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { BotConfig } from "@/config";
import { ProductProps } from "@/@shared/sharpify/api";
import { dotEnv, formatPrice } from "@/@shared/lib";
import TurndownService from "turndown";
import { SelectRole } from "./select-role";
import { getLocalStoreConfig } from "@/@shared/sharpify";
import { RemoveAllRolesComponent } from "./remove-all-roles.button";

@Injectable()
export class BuildRoleConfigure {
	constructor(
		@Inject(forwardRef(() => SelectRole))
		private readonly selectRole: SelectRole,
		@Inject(forwardRef(() => RemoveAllRolesComponent))
		private readonly removeAllRolesComponent: RemoveAllRolesComponent,
		@Inject(Client) private readonly client: Client,
	) {}

	async build(): Promise<string | InteractionReplyOptions | MessagePayload> {
		const roles = await this.client.guilds.fetch(dotEnv.DISCORD_GUILD_ID).then((guild) => guild.roles.fetch());

		const emmbed = new EmbedBuilder()
			.setColor(BotConfig.color)
			.setTitle("Configuração de Cargos por apos a compra")
			.setDescription(
				"Quando um membro realizar uma compra aqui pelo discord ou fazer uma compra estando logado pelo site usando o discord, ele receberá automaticamente os cargos configurados aqui!",
			);

		const store = await getLocalStoreConfig();

		for (const role of roles.values()) {
			const hasRoleInStore = store.applyRolesSettings?.some((r) => r.roleId === role.id);
			if (!hasRoleInStore) continue;
			emmbed.addFields({
				name: role.name,
				value: `\`${role.id}\``,
			});
		}

		const { RemoveAllRolesButton } = await this.removeAllRolesComponent.createButton();

		return {
			embeds: [emmbed],
			components: [
				this.selectRole.createSelectChannel({}),
				{
					type: 1,
					components: [RemoveAllRolesButton],
				},
			],
			flags: ["Ephemeral"],
		};
	}
}
