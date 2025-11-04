"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppUpdate", {
    enumerable: true,
    get: function() {
        return AppUpdate;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
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
let AppUpdate = class AppUpdate {
    async onPing([interaction]) {
        this.logger.log('Ping command triggered');
        await interaction.reply('🏓 Pong!');
    }
    constructor(){
        this.logger = new _common.Logger(AppUpdate.name);
    }
};
_ts_decorate([
    (0, _necord.SlashCommand)({
        name: 'ping',
        description: 'Replies with pong!',
        defaultMemberPermissions: [
            "Administrator"
        ]
    }),
    _ts_param(0, (0, _necord.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _necord.SlashCommandContext === "undefined" ? Object : _necord.SlashCommandContext
    ]),
    _ts_metadata("design:returntype", Promise)
], AppUpdate.prototype, "onPing", null);
AppUpdate = _ts_decorate([
    (0, _common.Injectable)()
], AppUpdate);

//# sourceMappingURL=bot.update.js.map