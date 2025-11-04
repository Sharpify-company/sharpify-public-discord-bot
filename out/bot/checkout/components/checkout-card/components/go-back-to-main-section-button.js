"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GoBackToMainSectionButionComponent", {
    enumerable: true,
    get: function() {
        return GoBackToMainSectionButionComponent;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _sectionmanager = require("../section-manager");
const _types = require("../../../../../@shared/types");
const _helpers = require("../../../../../@shared/helpers");
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
let GoBackToMainSectionButionComponent = class GoBackToMainSectionButionComponent {
    async handleButtonClicked([interaction]) {
        const result = await this.sectionManagerHandler.setSection({
            discordUserId: interaction.user.id,
            section: "MAIN"
        });
        await interaction.deferUpdate();
        await interaction.message.edit(result);
    }
    async createButton() {
        const backEmoji = await (0, _helpers.FindEmojiHelper)({
            client: this.client,
            name: "Sharpify_letsgo"
        });
        const backToSummaryButton = new _discord.ButtonBuilder().setCustomId("go_back_to_checkout_main_section").setLabel("Voltar ao resumo do pedido").setStyle(_discord.ButtonStyle.Secondary);
        backEmoji && backToSummaryButton.setEmoji({
            id: backEmoji.id
        });
        return {
            backToSummaryButton
        };
    }
    constructor(client, sectionManagerHandler){
        this.client = client;
        this.sectionManagerHandler = sectionManagerHandler;
    }
};
_ts_decorate([
    (0, _necord.Button)("go_back_to_checkout_main_section"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], GoBackToMainSectionButionComponent.prototype, "handleButtonClicked", null);
GoBackToMainSectionButionComponent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_sectionmanager.SectionManagerHandler))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType
    ])
], GoBackToMainSectionButionComponent);

//# sourceMappingURL=go-back-to-main-section-button.js.map