"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HandleDiscordMemberNotFound", {
    enumerable: true,
    get: function() {
        return HandleDiscordMemberNotFound;
    }
});
async function HandleDiscordMemberNotFound({ interaction }) {
    return await interaction.reply({
        content: "Usuário não encontrado. Por favor, realize uma ação no servidor primeiro.",
        flags: [
            "Ephemeral"
        ]
    });
}

//# sourceMappingURL=handle-discord-member-not-found.js.map