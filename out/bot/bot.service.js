"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppService", {
    enumerable: true,
    get: function() {
        return AppService;
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
let AppService = class AppService {
    onReady([client]) {
        this.logger.log(`Bot logged in as ${client.user?.tag}`);
    }
    constructor(){
        this.logger = new _common.Logger(AppService.name);
    }
};
_ts_decorate([
    (0, _necord.Once)('clientReady'),
    _ts_param(0, (0, _necord.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _necord.ContextOf === "undefined" ? Object : _necord.ContextOf
    ]),
    _ts_metadata("design:returntype", void 0)
], AppService.prototype, "onReady", null);
AppService = _ts_decorate([
    (0, _common.Injectable)()
], AppService);

//# sourceMappingURL=bot.service.js.map