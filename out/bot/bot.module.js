"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BotModule", {
    enumerable: true,
    get: function() {
        return BotModule;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _lib = require("../@shared/lib");
const _botupdate = require("./bot.update");
const _botservice = require("./bot.service");
const _productsmodule = require("./products/products.module");
const _checkoutmodule = require("./checkout/checkout.module");
const _emojiservice = require("./emoji.service");
const _rolessettingsmodule = require("./roles-settings/roles-settings.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let BotModule = class BotModule {
};
BotModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _necord.NecordModule.forRoot({
                token: _lib.dotEnv.DISCORD_TOKEN,
                development: [
                    _lib.dotEnv.DISCORD_GUILD_ID
                ],
                intents: [
                    "Guilds",
                    "GuildMessages",
                    "Guilds",
                    "GuildMembers",
                    "GuildMessages",
                    "GuildMessageReactions",
                    "GuildPresences",
                    "MessageContent"
                ]
            }),
            _productsmodule.ProductsModule,
            _checkoutmodule.CheckoutModule,
            _rolessettingsmodule.RoleSettingsModule
        ],
        controllers: [],
        providers: [
            _botupdate.AppUpdate,
            _botservice.AppService,
            _emojiservice.EmojiService
        ]
    })
], BotModule);

//# sourceMappingURL=bot.module.js.map