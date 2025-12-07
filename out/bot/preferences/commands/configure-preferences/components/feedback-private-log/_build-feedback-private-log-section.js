"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BuildFeedbackPrivateLogSection", {
    enumerable: true,
    get: function() {
        return BuildFeedbackPrivateLogSection;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
const _config = require("../../../../../../config");
const _selectpubliclogchannelsection = require("./select-public-log-channel-section");
const _gobackbutton = require("../go-back-button");
const _enableprivatelogbutton = require("./enable-private-log-button");
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
let BuildFeedbackPrivateLogSection = class BuildFeedbackPrivateLogSection {
    async build() {
        const emmbed = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle("Configurar log de feedback privado").setDescription("Cada alteração vai ser automaticamente refletida no bot.");
        const selectChannel = await this.selectFeedbackPrivateLogChannel.createSelectChannel();
        const { goBackButtonButton } = await this.goBackButtonComponent.createButton();
        const { enableFeedbackPrivateLogButton } = await this.enableFeedbackPrivateLogButton.createButton();
        return {
            embeds: [
                emmbed
            ],
            components: [
                {
                    type: 1,
                    components: [
                        enableFeedbackPrivateLogButton,
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
    constructor(selectFeedbackPrivateLogChannel, goBackButtonComponent, enableFeedbackPrivateLogButton, client){
        this.selectFeedbackPrivateLogChannel = selectFeedbackPrivateLogChannel;
        this.goBackButtonComponent = goBackButtonComponent;
        this.enableFeedbackPrivateLogButton = enableFeedbackPrivateLogButton;
        this.client = client;
    }
};
BuildFeedbackPrivateLogSection = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)((0, _common.forwardRef)(()=>_selectpubliclogchannelsection.SelectFeedbackPrivateLogChannel))),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_gobackbutton.GoBackButtonComponent))),
    _ts_param(2, (0, _common.Inject)((0, _common.forwardRef)(()=>_enableprivatelogbutton.EnableFeedbackPrivateLogButton))),
    _ts_param(3, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _selectpubliclogchannelsection.SelectFeedbackPrivateLogChannel === "undefined" ? Object : _selectpubliclogchannelsection.SelectFeedbackPrivateLogChannel,
        typeof _gobackbutton.GoBackButtonComponent === "undefined" ? Object : _gobackbutton.GoBackButtonComponent,
        typeof _enableprivatelogbutton.EnableFeedbackPrivateLogButton === "undefined" ? Object : _enableprivatelogbutton.EnableFeedbackPrivateLogButton,
        typeof _discord.Client === "undefined" ? Object : _discord.Client
    ])
], BuildFeedbackPrivateLogSection);

//# sourceMappingURL=_build-feedback-private-log-section.js.map