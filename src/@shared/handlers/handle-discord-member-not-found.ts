import { ButtonInteraction, ModalSubmitInteraction } from "discord.js";

export async function HandleDiscordMemberNotFound({ interaction }: { interaction: ButtonInteraction | ModalSubmitInteraction }) {
	return await interaction.reply({
		content: "Usuário não encontrado. Por favor, realize uma ação no servidor primeiro.",
		flags: ["Ephemeral"],
	});
}
