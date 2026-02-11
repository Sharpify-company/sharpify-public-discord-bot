import { forwardRef, Inject, Injectable } from "@nestjs/common";
import {
	Modal,
	Context,
	SlashCommand,
	SlashCommandContext,
	Ctx,
	StringSelect,
	StringSelectContext,
	RoleSelectContext,
	SelectedStrings,
	SelectedChannels,
	RoleSelect,
	ISelectedRoles,
	ComponentParam,
	SelectedRoles,
} from "necord";
import {
	ActionRowBuilder,
	CacheType,
	ChannelSelectMenuBuilder,
	RoleSelectMenuBuilder,
	ChannelType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	ModalSubmitInteraction,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { BotConfig } from "@/config";
import { ProductProps } from "@/@shared/sharpify/api";
import { formatPrice } from "@/@shared/lib";
import TurndownService from "turndown";
import { ProductCardComponent } from "@/bot/checkout/components";
import { getLocalStoreConfig, Sharpify } from "@/@shared/sharpify";
import { OrderEntity, ProductEntity } from "@/@shared/db/entities";
import { BuildRoleConfigure } from "./_build-role-configure";
import { WrapperType } from "@/@shared/types";

@Injectable()
export class SelectRole {
	constructor(
		@Inject(forwardRef(() => BuildRoleConfigure))
		private readonly buildRoleConfigure: WrapperType<BuildRoleConfigure>,
	) {}

	@RoleSelect("select_role_on_purchase")
	private async handleRolelSelected(@Context() [interaction]: RoleSelectContext, @SelectedRoles() selected: ISelectedRoles) {
		const role = selected.first();
		if (!role) {
			return interaction.reply({
				content: "Nenhum cargo foi selecionado!",
				flags: ["Ephemeral"],
			});
		}
		if (role.permissions === "Administrator") {
			return interaction.reply({
				content: "Cargos com permissão de Administrador não podem ser selecionados!",
				flags: ["Ephemeral"],
			});
		}

		const store = await getLocalStoreConfig();

		const hasRole = (store.applyRolesSettings || []).some((r) => r.roleId === role.id);
		if (hasRole) {
			return interaction.reply({
				content: "Cargo já está selecionado!",
				flags: ["Ephemeral"],
			});
		}

		await store.updateRoleSettings([...(store.applyRolesSettings || []), { roleId: role.id }]);

		// interaction.message.edit(await this.buildRoleConfigure.build());
		interaction.update((await this.buildRoleConfigure.build()) as any);
	}

	createSelectChannel({}: {}) {
		const selectMenu = new RoleSelectMenuBuilder()
			.setCustomId(`select_role_on_purchase`)
			.setPlaceholder("Selecione qual cargo colocar para o cliente...")
			.setMaxValues(1)
			.setMinValues(1);
		return new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(selectMenu);
	}
}
