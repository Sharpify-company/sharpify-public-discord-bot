"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConfigurePreferencesModule", {
    enumerable: true,
    get: function() {
        return ConfigurePreferencesModule;
    }
});
const _common = require("@nestjs/common");
const _buildpreferenceconfigure = require("./components/_build-preference-configure");
const _configurepreferencescommand = require("./configure-preferences.command");
const _gobackbutton = require("./components/go-back-button");
const _salesprivatelogmodule = require("./components/sales-private-log/sales-private-log.module");
const _salespubliclogmodule = require("./components/sales-public-log/sales-public-log.module");
const _faillogmodule = require("./components/fail-log/fail-log.module");
const _confirmdeliverylogmodule = require("./components/confirm-delivery-log/confirm-delivery-log.module");
const _feedbackpubliclogmodule = require("./components/feedback-public-log/feedback-public-log.module");
const _feedbackprivatelogmodule = require("./components/feedback-private-log/feedback-private-log.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ConfigurePreferencesModule = class ConfigurePreferencesModule {
};
ConfigurePreferencesModule = _ts_decorate([
    (0, _common.Global)(),
    (0, _common.Module)({
        imports: [
            _salesprivatelogmodule.SalesPrivateLogModule,
            _salespubliclogmodule.SalesPublicLogModule,
            _faillogmodule.FailLogModule,
            _confirmdeliverylogmodule.ConfirmDeliveryLogModule,
            _feedbackpubliclogmodule.FeedbackPublicLogModule,
            _feedbackprivatelogmodule.FeedbackPrivateLogModule
        ],
        controllers: [],
        providers: [
            _configurepreferencescommand.ConfigureRolesCommand,
            _gobackbutton.GoBackButtonComponent,
            _buildpreferenceconfigure.BuildPreferenceConfigure
        ],
        exports: [
            _configurepreferencescommand.ConfigureRolesCommand,
            _gobackbutton.GoBackButtonComponent,
            _buildpreferenceconfigure.BuildPreferenceConfigure
        ]
    })
], ConfigurePreferencesModule);

//# sourceMappingURL=configure-preferences.module.js.map