"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LogChannel", {
    enumerable: true,
    get: function() {
        return LogChannel;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
const _lib = require("./@shared/lib");
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
let LogChannel = class LogChannel {
    async sendMessage(options) {
        if (!_lib.dotEnv.LOG_CHANNEL_ID) return;
        const channel = await this.client?.channels.fetch(_lib.dotEnv.LOG_CHANNEL_ID).catch(()=>null);
        if (!channel || !channel.isTextBased()) return;
        await channel.send(options).catch((err)=>{
            console.error("❌ Failed to send log message:", err);
        });
    }
    constructor(client){
        this.client = client;
    }
};
LogChannel = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client
    ])
], LogChannel);

//# sourceMappingURL=log-channel.service.js.map