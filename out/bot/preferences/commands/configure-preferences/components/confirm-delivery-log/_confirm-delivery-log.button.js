"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConfirmDeliveryLogButtonComponent", {
    enumerable: true,
    get: function() {
        return ConfirmDeliveryLogButtonComponent;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _types = require("../../../../../../@shared/types");
const _sharpify = require("../../../../../../@shared/sharpify");
const _buildpreferenceconfigure = require("../_build-preference-configure");
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
let ConfirmDeliveryLogButtonComponent = class ConfirmDeliveryLogButtonComponent {
    async log([interaction]) {
        const store = await (0, _sharpify.getLocalStoreConfig)();
        await interaction.update(await this.buildPreferenceConfigure.build({
            section: "CONFIRM_DELIVERY_LOG"
        }));
    }
    async createButton() {
        const confirmDeliveryLogButton = new _discord.ButtonBuilder().setCustomId("go_to_confirm_delivery_log_settings").setLabel("Configurar log de confirmação de entrega").setStyle(_discord.ButtonStyle.Secondary);
        return {
            confirmDeliveryLogButton
        };
    }
    constructor(client, buildPreferenceConfigure){
        this.client = client;
        this.buildPreferenceConfigure = buildPreferenceConfigure;
    }
};
_ts_decorate([
    (0, _necord.Button)("go_to_confirm_delivery_log_settings"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], ConfirmDeliveryLogButtonComponent.prototype, "log", null);
ConfirmDeliveryLogButtonComponent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_buildpreferenceconfigure.BuildPreferenceConfigure))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType
    ])
], ConfirmDeliveryLogButtonComponent);

//# sourceMappingURL=_confirm-delivery-log.button.js.map