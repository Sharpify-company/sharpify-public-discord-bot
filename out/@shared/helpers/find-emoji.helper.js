"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FindEmojiHelper", {
    enumerable: true,
    get: function() {
        return FindEmojiHelper;
    }
});
const _entities = require("../db/entities");
async function FindEmojiHelper({ client, name }) {
    const ticketEmojiEntity = await _entities.EmojiEntity.findOneBy({
        name
    });
    const cacheEmoji = client.application?.emojis.cache.get(ticketEmojiEntity?.id);
    if (cacheEmoji) return cacheEmoji;
    return await client.application?.emojis.fetch(ticketEmojiEntity?.id).catch(()=>null);
}

//# sourceMappingURL=find-emoji.helper.js.map