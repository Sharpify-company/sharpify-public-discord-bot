"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OpenDmTutorialButtonComponent", {
    enumerable: true,
    get: function() {
        return OpenDmTutorialButtonComponent;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _config = require("../../../../../config");
const _sectionmanager = require("../section-manager");
const _types = require("../../../../../@shared/types");
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
let OpenDmTutorialButtonComponent = class OpenDmTutorialButtonComponent {
    async handleButtonClicked([interaction], productIdAndItemId) {
        const OpenDm = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle(`Tutorial Como abrir a DM?`).setDescription("Sem a DM aberta, você não poderá receber o produto comprado pelo discord.").setImage("https://public-blob.squarecloud.dev/498013966740619264/zennify_guides/open_discord_dm_mczscx7n-31ba.webp");
        await interaction.reply({
            embeds: [
                OpenDm
            ],
            flags: [
                "Ephemeral"
            ]
        });
    }
    async createButton() {
        const OpenDmTutorialButton = new _discord.ButtonBuilder().setCustomId(`open_dm_tutorial_button`).setLabel("Como abrir a DM").setStyle(_discord.ButtonStyle.Primary).setEmoji("💬");
        return {
            OpenDmTutorialButton
        };
    }
    constructor(client, sectionManagerHandler){
        this.client = client;
        this.sectionManagerHandler = sectionManagerHandler;
    }
};
_ts_decorate([
    (0, _necord.Button)("open_dm_tutorial_button"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_param(1, (0, _necord.ComponentParam)("productIdAndItemId")),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], OpenDmTutorialButtonComponent.prototype, "handleButtonClicked", null);
OpenDmTutorialButtonComponent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_sectionmanager.SectionManagerHandler))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType
    ])
], OpenDmTutorialButtonComponent);

//# sourceMappingURL=open-dm-tutorial-button.js.map