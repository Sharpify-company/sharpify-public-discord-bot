"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SalesPrivateLogModule", {
    enumerable: true,
    get: function() {
        return SalesPrivateLogModule;
    }
});
const _common = require("@nestjs/common");
const _buildsalesprivatelogsection = require("./_build-sales-private-log-section");
const _selectprivatelogchannelsection = require("./select-private-log-channel-section");
const _salesprivatelogbutton = require("./_sales-private-log.button");
const _enableprivatelogbutton = require("./enable-private-log-button");
const _onlydiscordsalesbutton = require("./only-discord-sales.button");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let SalesPrivateLogModule = class SalesPrivateLogModule {
};
SalesPrivateLogModule = _ts_decorate([
    (0, _common.Global)(),
    (0, _common.Module)({
        imports: [],
        controllers: [],
        providers: [
            _buildsalesprivatelogsection.BuildSalesPrivateLogSection,
            _selectprivatelogchannelsection.SelectSalesPrivateLogChannel,
            _salesprivatelogbutton.SalesPrivateLogButtonComponent,
            _enableprivatelogbutton.EnableSalesPrivateLogButton,
            _onlydiscordsalesbutton.OnlyDiscordSalesPrivateLogButton
        ],
        exports: [
            _buildsalesprivatelogsection.BuildSalesPrivateLogSection,
            _selectprivatelogchannelsection.SelectSalesPrivateLogChannel,
            _salesprivatelogbutton.SalesPrivateLogButtonComponent,
            _enableprivatelogbutton.EnableSalesPrivateLogButton,
            _onlydiscordsalesbutton.OnlyDiscordSalesPrivateLogButton
        ]
    })
], SalesPrivateLogModule);

//# sourceMappingURL=sales-private-log.module.js.map