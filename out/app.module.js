"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _botmodule = require("./bot/bot.module");
const _workermodule = require("./workers/worker.module");
const _schedule = require("@nestjs/schedule");
const _appwsservice = require("./app.ws.service");
const _websocketmodule = require("./websocket/websocket.module");
const _logchannelservice = require("./log-channel.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
};
AppModule = _ts_decorate([
    (0, _common.Global)(),
    (0, _common.Module)({
        imports: [
            _schedule.ScheduleModule.forRoot(),
            _botmodule.BotModule,
            _workermodule.WokerModule,
            _websocketmodule.WebsocketModule
        ],
        controllers: [],
        providers: [
            _appwsservice.WsClientService,
            _logchannelservice.LogChannel
        ],
        exports: [
            _appwsservice.WsClientService,
            _logchannelservice.LogChannel
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map