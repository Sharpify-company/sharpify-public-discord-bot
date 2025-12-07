"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BuildFeedbackPublicLogSection", {
    enumerable: true,
    get: function() {
        return BuildFeedbackPublicLogSection;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
const _config = require("../../../../../../config");
const _selectpubliclogchannelsection = require("./select-public-log-channel-section");
const _gobackbutton = require("../go-back-button");
const _enablepubliclogbutton = require("./enable-public-log-button");
const _onlydiscordsalesbutton = require("./only-discord-sales.button");
const _minfeedbackstar = require("./min-feedback-star");
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
let BuildFeedbackPublicLogSection = class BuildFeedbackPublicLogSection {
    async build() {
        const emmbed = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle("Configurar log de feedback publico").setDescription("Cada alteração vai ser automaticamente refletida no bot.");
        const selectChannel = await this.selectFeedbackPublicLogChannel.createSelectChannel();
        const { goBackButtonButton } = await this.goBackButtonComponent.createButton();
        const { enableFeedbackPublicLogButton } = await this.enableFeedbackPublicLogButton.createButton();
        const { onlyDiscordSalesPublicLogButton } = await this.onlyDiscordFeebackSalesPublicLogButton.createButton();
        const { minFeedbackStarButton } = await this.minFeedbackStarButton.createButton();
        return {
            embeds: [
                emmbed
            ],
            components: [
                {
                    type: 1,
                    components: [
                        enableFeedbackPublicLogButton,
                        onlyDiscordSalesPublicLogButton,
                        minFeedbackStarButton,
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
    constructor(selectFeedbackPublicLogChannel, goBackButtonComponent, enableFeedbackPublicLogButton, onlyDiscordFeebackSalesPublicLogButton, minFeedbackStarButton, client){
        this.selectFeedbackPublicLogChannel = selectFeedbackPublicLogChannel;
        this.goBackButtonComponent = goBackButtonComponent;
        this.enableFeedbackPublicLogButton = enableFeedbackPublicLogButton;
        this.onlyDiscordFeebackSalesPublicLogButton = onlyDiscordFeebackSalesPublicLogButton;
        this.minFeedbackStarButton = minFeedbackStarButton;
        this.client = client;
    }
};
BuildFeedbackPublicLogSection = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)((0, _common.forwardRef)(()=>_selectpubliclogchannelsection.SelectFeedbackPublicLogChannel))),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_gobackbutton.GoBackButtonComponent))),
    _ts_param(2, (0, _common.Inject)((0, _common.forwardRef)(()=>_enablepubliclogbutton.EnableFeedbackPublicLogButton))),
    _ts_param(3, (0, _common.Inject)((0, _common.forwardRef)(()=>_onlydiscordsalesbutton.OnlyDiscordFeebackSalesPublicLogButton))),
    _ts_param(4, (0, _common.Inject)((0, _common.forwardRef)(()=>_minfeedbackstar.MinFeedbackStarButton))),
    _ts_param(5, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _selectpubliclogchannelsection.SelectFeedbackPublicLogChannel === "undefined" ? Object : _selectpubliclogchannelsection.SelectFeedbackPublicLogChannel,
        typeof _gobackbutton.GoBackButtonComponent === "undefined" ? Object : _gobackbutton.GoBackButtonComponent,
        typeof _enablepubliclogbutton.EnableFeedbackPublicLogButton === "undefined" ? Object : _enablepubliclogbutton.EnableFeedbackPublicLogButton,
        typeof _onlydiscordsalesbutton.OnlyDiscordFeebackSalesPublicLogButton === "undefined" ? Object : _onlydiscordsalesbutton.OnlyDiscordFeebackSalesPublicLogButton,
        typeof _minfeedbackstar.MinFeedbackStarButton === "undefined" ? Object : _minfeedbackstar.MinFeedbackStarButton,
        typeof _discord.Client === "undefined" ? Object : _discord.Client
    ])
], BuildFeedbackPublicLogSection);

//# sourceMappingURL=_build-feedback-public-log-section.js.map