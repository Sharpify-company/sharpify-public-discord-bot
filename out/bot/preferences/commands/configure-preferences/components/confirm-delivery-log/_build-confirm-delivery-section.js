"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BuildConfirmDeliveryLogSection", {
    enumerable: true,
    get: function() {
        return BuildConfirmDeliveryLogSection;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
const _config = require("../../../../../../config");
const _selectconfirmdeliverylogchannelsection = require("./select-confirm-delivery-log-channel-section");
const _gobackbutton = require("../go-back-button");
const _enableconfirmdeliverylogbutton = require("./enable-confirm-delivery-log-button");
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
let BuildConfirmDeliveryLogSection = class BuildConfirmDeliveryLogSection {
    async build() {
        const emmbed = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle("Configurar log de confirmação de entrega").setDescription("Cada alteração vai ser automaticamente refletida no bot.");
        const selectChannel = await this.selectConfirmDeliveryLogChannel.createSelectChannel();
        const { goBackButtonButton } = await this.goBackButtonComponent.createButton();
        const { enableConfirmDeliveryLogButton } = await this.enableConfirmDeliveryLogButton.createButton();
        return {
            embeds: [
                emmbed
            ],
            components: [
                {
                    type: 1,
                    components: [
                        enableConfirmDeliveryLogButton,
                        goBackButtonButton
                    ]
                },
                selectChannel
            ],
            flags: [
                "Ephemeral"
            ]
        };
    }
    constructor(selectConfirmDeliveryLogChannel, goBackButtonComponent, enableConfirmDeliveryLogButton, client){
        this.selectConfirmDeliveryLogChannel = selectConfirmDeliveryLogChannel;
        this.goBackButtonComponent = goBackButtonComponent;
        this.enableConfirmDeliveryLogButton = enableConfirmDeliveryLogButton;
        this.client = client;
    }
};
BuildConfirmDeliveryLogSection = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)((0, _common.forwardRef)(()=>_selectconfirmdeliverylogchannelsection.SelectConfirmDeliveryLogChannel))),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_gobackbutton.GoBackButtonComponent))),
    _ts_param(2, (0, _common.Inject)((0, _common.forwardRef)(()=>_enableconfirmdeliverylogbutton.EnableConfirmDeliveryLogButton))),
    _ts_param(3, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _selectconfirmdeliverylogchannelsection.SelectConfirmDeliveryLogChannel === "undefined" ? Object : _selectconfirmdeliverylogchannelsection.SelectConfirmDeliveryLogChannel,
        typeof _gobackbutton.GoBackButtonComponent === "undefined" ? Object : _gobackbutton.GoBackButtonComponent,
        typeof _enableconfirmdeliverylogbutton.EnableConfirmDeliveryLogButton === "undefined" ? Object : _enableconfirmdeliverylogbutton.EnableConfirmDeliveryLogButton,
        typeof _discord.Client === "undefined" ? Object : _discord.Client
    ])
], BuildConfirmDeliveryLogSection);

//# sourceMappingURL=_build-confirm-delivery-section.js.map