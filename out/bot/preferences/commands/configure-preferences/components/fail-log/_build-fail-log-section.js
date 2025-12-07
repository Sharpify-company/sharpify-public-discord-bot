"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BuildFailLogSection", {
    enumerable: true,
    get: function() {
        return BuildFailLogSection;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
const _config = require("../../../../../../config");
const _selectfaillogchannelsection = require("./select-fail-log-channel-section");
const _gobackbutton = require("../go-back-button");
const _enablefaillogbutton = require("./enable-fail-log-button");
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
let BuildFailLogSection = class BuildFailLogSection {
    async build() {
        const emmbed = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle("Configurar log de falhas").setDescription(`
Cada alteração vai ser automaticamente refletida no bot.
Cada falha em uma venda será registrada neste canal.
Como exemplo: falhas de pagamento, erros na entrega do produto na DM, etc.
		`);
        const selectChannel = await this.selectFailLogChannel.createSelectChannel();
        const { goBackButtonButton } = await this.goBackButtonComponent.createButton();
        const { enableFailLogButton } = await this.enableFailLogButton.createButton();
        return {
            embeds: [
                emmbed
            ],
            components: [
                {
                    type: 1,
                    components: [
                        enableFailLogButton,
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
    constructor(selectFailLogChannel, goBackButtonComponent, enableFailLogButton, client){
        this.selectFailLogChannel = selectFailLogChannel;
        this.goBackButtonComponent = goBackButtonComponent;
        this.enableFailLogButton = enableFailLogButton;
        this.client = client;
    }
};
BuildFailLogSection = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)((0, _common.forwardRef)(()=>_selectfaillogchannelsection.SelectFailLogChannel))),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_gobackbutton.GoBackButtonComponent))),
    _ts_param(2, (0, _common.Inject)((0, _common.forwardRef)(()=>_enablefaillogbutton.EnableFailLogButton))),
    _ts_param(3, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _selectfaillogchannelsection.SelectFailLogChannel === "undefined" ? Object : _selectfaillogchannelsection.SelectFailLogChannel,
        typeof _gobackbutton.GoBackButtonComponent === "undefined" ? Object : _gobackbutton.GoBackButtonComponent,
        typeof _enablefaillogbutton.EnableFailLogButton === "undefined" ? Object : _enablefaillogbutton.EnableFailLogButton,
        typeof _discord.Client === "undefined" ? Object : _discord.Client
    ])
], BuildFailLogSection);

//# sourceMappingURL=_build-fail-log-section.js.map