"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConfirmDeliveryLogModule", {
    enumerable: true,
    get: function() {
        return ConfirmDeliveryLogModule;
    }
});
const _common = require("@nestjs/common");
const _buildconfirmdeliverysection = require("./_build-confirm-delivery-section");
const _selectconfirmdeliverylogchannelsection = require("./select-confirm-delivery-log-channel-section");
const _confirmdeliverylogbutton = require("./_confirm-delivery-log.button");
const _enableconfirmdeliverylogbutton = require("./enable-confirm-delivery-log-button");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ConfirmDeliveryLogModule = class ConfirmDeliveryLogModule {
};
ConfirmDeliveryLogModule = _ts_decorate([
    (0, _common.Global)(),
    (0, _common.Module)({
        imports: [],
        controllers: [],
        providers: [
            _buildconfirmdeliverysection.BuildConfirmDeliveryLogSection,
            _selectconfirmdeliverylogchannelsection.SelectConfirmDeliveryLogChannel,
            _confirmdeliverylogbutton.ConfirmDeliveryLogButtonComponent,
            _enableconfirmdeliverylogbutton.EnableConfirmDeliveryLogButton
        ],
        exports: [
            _buildconfirmdeliverysection.BuildConfirmDeliveryLogSection,
            _selectconfirmdeliverylogchannelsection.SelectConfirmDeliveryLogChannel,
            _confirmdeliverylogbutton.ConfirmDeliveryLogButtonComponent,
            _enableconfirmdeliverylogbutton.EnableConfirmDeliveryLogButton
        ]
    })
], ConfirmDeliveryLogModule);

//# sourceMappingURL=confirm-delivery-log.module.js.map