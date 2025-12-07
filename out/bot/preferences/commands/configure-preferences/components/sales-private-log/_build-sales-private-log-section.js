"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BuildSalesPrivateLogSection", {
    enumerable: true,
    get: function() {
        return BuildSalesPrivateLogSection;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
const _config = require("../../../../../../config");
const _selectprivatelogchannelsection = require("./select-private-log-channel-section");
const _gobackbutton = require("../go-back-button");
const _enableprivatelogbutton = require("./enable-private-log-button");
const _onlydiscordsalesbutton = require("./only-discord-sales.button");
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
let BuildSalesPrivateLogSection = class BuildSalesPrivateLogSection {
    async build() {
        const emmbed = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle("Configurar log de venda privado").setDescription("Cada alteração vai ser automaticamente refletida no bot.");
        const selectChannel = await this.selectSalesPrivateLogChannel.createSelectChannel();
        const { goBackButtonButton } = await this.goBackButtonComponent.createButton();
        const { enableSalesPrivateLogButton } = await this.enableSalesPrivateLogButton.createButton();
        const { onlyDiscordSalesPrivateLogButton } = await this.onlyDiscordSalesPrivateLogButton.createButton();
        return {
            embeds: [
                emmbed
            ],
            components: [
                {
                    type: 1,
                    components: [
                        enableSalesPrivateLogButton,
                        onlyDiscordSalesPrivateLogButton,
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
    constructor(selectSalesPrivateLogChannel, goBackButtonComponent, enableSalesPrivateLogButton, onlyDiscordSalesPrivateLogButton, client){
        this.selectSalesPrivateLogChannel = selectSalesPrivateLogChannel;
        this.goBackButtonComponent = goBackButtonComponent;
        this.enableSalesPrivateLogButton = enableSalesPrivateLogButton;
        this.onlyDiscordSalesPrivateLogButton = onlyDiscordSalesPrivateLogButton;
        this.client = client;
    }
};
BuildSalesPrivateLogSection = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)((0, _common.forwardRef)(()=>_selectprivatelogchannelsection.SelectSalesPrivateLogChannel))),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_gobackbutton.GoBackButtonComponent))),
    _ts_param(2, (0, _common.Inject)((0, _common.forwardRef)(()=>_enableprivatelogbutton.EnableSalesPrivateLogButton))),
    _ts_param(3, (0, _common.Inject)((0, _common.forwardRef)(()=>_onlydiscordsalesbutton.OnlyDiscordSalesPrivateLogButton))),
    _ts_param(4, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _selectprivatelogchannelsection.SelectSalesPrivateLogChannel === "undefined" ? Object : _selectprivatelogchannelsection.SelectSalesPrivateLogChannel,
        typeof _gobackbutton.GoBackButtonComponent === "undefined" ? Object : _gobackbutton.GoBackButtonComponent,
        typeof _enableprivatelogbutton.EnableSalesPrivateLogButton === "undefined" ? Object : _enableprivatelogbutton.EnableSalesPrivateLogButton,
        typeof _onlydiscordsalesbutton.OnlyDiscordSalesPrivateLogButton === "undefined" ? Object : _onlydiscordsalesbutton.OnlyDiscordSalesPrivateLogButton,
        typeof _discord.Client === "undefined" ? Object : _discord.Client
    ])
], BuildSalesPrivateLogSection);

//# sourceMappingURL=_build-sales-private-log-section.js.map