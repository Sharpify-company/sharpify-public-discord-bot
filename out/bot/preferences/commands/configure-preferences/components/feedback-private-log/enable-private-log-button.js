"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EnableFeedbackPrivateLogButton", {
    enumerable: true,
    get: function() {
        return EnableFeedbackPrivateLogButton;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _types = require("../../../../../../@shared/types");
const _sharpify = require("../../../../../../@shared/sharpify");
const _buildfeedbackprivatelogsection = require("./_build-feedback-private-log-section");
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
let EnableFeedbackPrivateLogButton = class EnableFeedbackPrivateLogButton {
    async disablePulicLog([interaction]) {
        const store = await (0, _sharpify.getLocalStoreConfig)();
        const preferences = store.getPreferences();
        preferences.feedbackPrivateLog.enabled = false;
        await store.savePreferences(preferences);
        await interaction.update(await this.buildFeedbackPrivateLogSection.build());
    }
    async enablePrivateLog([interaction]) {
        const store = await (0, _sharpify.getLocalStoreConfig)();
        const preferences = store.getPreferences();
        preferences.feedbackPrivateLog.enabled = true;
        await store.savePreferences(preferences);
        await interaction.update(await this.buildFeedbackPrivateLogSection.build());
    }
    async createButton() {
        const storeEntity = await (0, _sharpify.getLocalStoreConfig)();
        let enableFeedbackPrivateLogButton = null;
        const preferences = storeEntity.getPreferences();
        if (preferences.feedbackPrivateLog.enabled) {
            enableFeedbackPrivateLogButton = new _discord.ButtonBuilder().setCustomId("disable_feedback_private_log").setLabel("Desativar log de feedback Privado").setStyle(_discord.ButtonStyle.Danger);
        } else {
            enableFeedbackPrivateLogButton = new _discord.ButtonBuilder().setCustomId("enable_feedback_private_log").setLabel("Ativar log de feedback privado").setStyle(_discord.ButtonStyle.Success);
        }
        return {
            enableFeedbackPrivateLogButton
        };
    }
    constructor(client, buildFeedbackPrivateLogSection){
        this.client = client;
        this.buildFeedbackPrivateLogSection = buildFeedbackPrivateLogSection;
    }
};
_ts_decorate([
    (0, _necord.Button)("disable_feedback_private_log"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], EnableFeedbackPrivateLogButton.prototype, "disablePulicLog", null);
_ts_decorate([
    (0, _necord.Button)("enable_feedback_private_log"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], EnableFeedbackPrivateLogButton.prototype, "enablePrivateLog", null);
EnableFeedbackPrivateLogButton = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_buildfeedbackprivatelogsection.BuildFeedbackPrivateLogSection))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType
    ])
], EnableFeedbackPrivateLogButton);

//# sourceMappingURL=enable-private-log-button.js.map