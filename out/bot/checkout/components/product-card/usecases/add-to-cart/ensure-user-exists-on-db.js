"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EnsureUserExistsOnDb", {
    enumerable: true,
    get: function() {
        return EnsureUserExistsOnDb;
    }
});
const _lib = require("../../../../../../@shared/lib");
const _entities = require("../../../../../../@shared/db/entities");
async function EnsureUserExistsOnDb({ interaction }) {
    const member = interaction.member;
    if (!member?.user) {
        return (0, _lib.failure)(await interaction.reply({
            content: `Erro ao identificar usuário.`,
            flags: [
                "Ephemeral"
            ]
        }));
    }
    let discordUserEntity = await _entities.DiscordUserEntity.findOneBy({
        id: member.user.id
    });
    if (!discordUserEntity) {
        discordUserEntity = _entities.DiscordUserEntity.create({
            id: member.user.id
        });
        await discordUserEntity.save();
    }
    return (0, _lib.success)(discordUserEntity);
}

//# sourceMappingURL=ensure-user-exists-on-db.js.map