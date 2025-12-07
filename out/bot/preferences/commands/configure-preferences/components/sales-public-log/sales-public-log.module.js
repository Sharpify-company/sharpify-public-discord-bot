"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SalesPublicLogModule", {
    enumerable: true,
    get: function() {
        return SalesPublicLogModule;
    }
});
const _common = require("@nestjs/common");
const _buildsalespubliclogsection = require("./_build-sales-public-log-section");
const _selectpubliclogchannelsection = require("./select-public-log-channel-section");
const _salespubliclogbutton = require("./_sales-public-log.button");
const _enablepubliclogbutton = require("./enable-public-log-button");
const _onlydiscordsalesbutton = require("./only-discord-sales.button");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let SalesPublicLogModule = class SalesPublicLogModule {
};
SalesPublicLogModule = _ts_decorate([
    (0, _common.Global)(),
    (0, _common.Module)({
        imports: [],
        controllers: [],
        providers: [
            _buildsalespubliclogsection.BuildSalesPublicLogSection,
            _selectpubliclogchannelsection.SelectSalesPublicLogChannel,
            _salespubliclogbutton.SalesPublicLogButtonComponent,
            _enablepubliclogbutton.EnableSalesPublicLogButton,
            _onlydiscordsalesbutton.OnlyDiscordSalesPublicLogButton
        ],
        exports: [
            _buildsalespubliclogsection.BuildSalesPublicLogSection,
            _selectpubliclogchannelsection.SelectSalesPublicLogChannel,
            _salespubliclogbutton.SalesPublicLogButtonComponent,
            _enablepubliclogbutton.EnableSalesPublicLogButton,
            _onlydiscordsalesbutton.OnlyDiscordSalesPublicLogButton
        ]
    })
], SalesPublicLogModule);

//# sourceMappingURL=sales-public-log.module.js.map