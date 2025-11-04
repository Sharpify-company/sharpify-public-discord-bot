"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmojiService", {
    enumerable: true,
    get: function() {
        return EmojiService;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _fs = /*#__PURE__*/ _interop_require_wildcard(require("fs"));
const _entities = require("../@shared/db/entities");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let EmojiService = class EmojiService {
    async onReady([client]) {
        const application = await client.application.fetch().catch(()=>null);
        if (!application) return console.log("Guild não encontrado.");
        const emojiDir = _path.default.join(process.cwd(), "assets", "emojis");
        if (!_fs.existsSync(emojiDir)) {
            console.error("❌ Pasta de emojis não encontrada:", emojiDir);
            return;
        }
        const files = _fs.readdirSync(emojiDir).filter((file)=>/\.(png|jpg|jpeg|gif)$/i.test(file));
        const AllEmojis = await application.emojis.fetch();
        for (const file of files){
            const emojiName = `Sharpify_${_path.default.parse(file).name}`;
            const existsOnDb = await _entities.EmojiEntity.findOneBy({
                name: emojiName
            });
            if (existsOnDb) continue;
            const filePath = _path.default.join(emojiDir, file);
            try {
                const emoji = await application.emojis.create({
                    name: emojiName,
                    attachment: filePath
                });
                await _entities.EmojiEntity.createEmoji({
                    id: emoji.id,
                    name: emoji.name
                }).save();
                console.log(`✅ Emoji criado: ${emoji.name}`);
            } catch (err) {
                if (err.code === 50035) {
                    const emojiExists = AllEmojis.find((e)=>e.name === emojiName);
                    if (emojiExists) {
                        await _entities.EmojiEntity.createEmoji({
                            id: emojiExists.id,
                            name: emojiExists.name
                        }).save();
                        console.log(`⚙️ Emoji '${emojiName}' já existe (erro capturado), salvando no banco de dados.`);
                        continue;
                    }
                    console.log(`⚙️ Emoji '${emojiName}' já existe (erro capturado), pulando.`);
                } else console.error(`❌ Erro ao criar emoji '${emojiName}':`, JSON.stringify(err));
            }
        }
    }
};
_ts_decorate([
    (0, _necord.Once)("clientReady"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _necord.ContextOf === "undefined" ? Object : _necord.ContextOf
    ]),
    _ts_metadata("design:returntype", Promise)
], EmojiService.prototype, "onReady", null);
EmojiService = _ts_decorate([
    (0, _common.Injectable)()
], EmojiService);

//# sourceMappingURL=emoji.service.js.map