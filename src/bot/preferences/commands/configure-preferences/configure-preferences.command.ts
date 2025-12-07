import { forwardRef, Inject, Injectable, Logger, UseInterceptors } from "@nestjs/common";
import { EmbedBuilder, Integration } from "discord.js";
import { Context, Options, SlashCommand, SlashCommandContext, StringOption } from "necord";
import { BuildPreferenceConfigure } from "./components/_build-preference-configure";

@Injectable()
export class ConfigureRolesCommand {
	constructor(
		@Inject(forwardRef(() => BuildPreferenceConfigure))
		private readonly buildPreferenceConfigure: BuildPreferenceConfigure,
	) {}

	@SlashCommand({
		name: "configurar-preferencias",
		description: "Configure as preferencias do bot. Como as Logs de venda!",
		defaultMemberPermissions: ["Administrator"],
	})
	public async onConfigureRoles(@Context() [interaction]: SlashCommandContext) {
		return interaction.reply(await this.buildPreferenceConfigure.build({ section: "MAIN" }));
	}
}
