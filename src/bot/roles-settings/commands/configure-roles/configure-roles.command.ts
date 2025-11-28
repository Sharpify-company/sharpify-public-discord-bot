import { forwardRef, Inject, Injectable, Logger, UseInterceptors } from "@nestjs/common";
import { EmbedBuilder, Integration } from "discord.js";
import { Context, Options, SlashCommand, SlashCommandContext, StringOption } from "necord";

import { getLocalStoreConfig, Sharpify } from "@/@shared/sharpify";
import { BotConfig } from "@/config";
import TurndownService from "turndown";
import { formatPrice } from "@/@shared/lib";
import { SelectRole } from "./components/select-role";
import { BuildRoleConfigure } from "./components/_build-role-configure";

@Injectable()
export class ConfigureRolesCommand {
	constructor(
		@Inject(forwardRef(() => BuildRoleConfigure))
		private readonly buildRoleConfigure: BuildRoleConfigure,
	) {}

	@SlashCommand({
		name: "configurar-cargos",
		description: "Configure os cargos que os membros do servidor vão receber apos realizar uma compra!",
		defaultMemberPermissions: ["Administrator"],
	})
	public async onConfigureRoles(@Context() [interaction]: SlashCommandContext) {
		return interaction.reply(await this.buildRoleConfigure.build());
	}
}
