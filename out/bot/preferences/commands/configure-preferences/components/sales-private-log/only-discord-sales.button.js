"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OnlyDiscordSalesPrivateLogButton", {
    enumerable: true,
    get: function() {
        return OnlyDiscordSalesPrivateLogButton;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _types = require("../../../../../../@shared/types");
const _sharpify = require("../../../../../../@shared/sharpify");
const _buildsalesprivatelogsection = require("./_build-sales-private-log-section");
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
let OnlyDiscordSalesPrivateLogButton = class OnlyDiscordSalesPrivateLogButton {
    async disablePulicLog([interaction]) {
        const store = await (0, _sharpify.getLocalStoreConfig)();
        const preferences = store.getPreferences();
        preferences.privateLogSales.onlyDiscordSales = false;
        await store.savePreferences(preferences);
        await interaction.update(await this.buildSalesPrivateLogSection.build());
    }
    async enablePrivateLog([interaction]) {
        const store = await (0, _sharpify.getLocalStoreConfig)();
        const preferences = store.getPreferences();
        preferences.privateLogSales.onlyDiscordSales = true;
        await store.savePreferences(preferences);
        await interaction.update(await this.buildSalesPrivateLogSection.build());
    }
    async createButton() {
        const storeEntity = await (0, _sharpify.getLocalStoreConfig)();
        let onlyDiscordSalesPrivateLogButton = null;
        const preferences = storeEntity.getPreferences();
        if (preferences.privateLogSales.onlyDiscordSales) {
            onlyDiscordSalesPrivateLogButton = new _discord.ButtonBuilder().setCustomId("disable_only_discord_sales_private_log").setLabel("Desativar somente vendas feita pelo Discord").setStyle(_discord.ButtonStyle.Danger);
        } else {
            onlyDiscordSalesPrivateLogButton = new _discord.ButtonBuilder().setCustomId("enable_only_discord_sales_private_log").setLabel("Ativar somente vendas feita pelo Discord").setStyle(_discord.ButtonStyle.Success);
        }
        return {
            onlyDiscordSalesPrivateLogButton
        };
    }
    constructor(client, buildSalesPrivateLogSection){
        this.client = client;
        this.buildSalesPrivateLogSection = buildSalesPrivateLogSection;
    }
};
_ts_decorate([
    (0, _necord.Button)("disable_only_discord_sales_private_log"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], OnlyDiscordSalesPrivateLogButton.prototype, "disablePulicLog", null);
_ts_decorate([
    (0, _necord.Button)("enable_only_discord_sales_private_log"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], OnlyDiscordSalesPrivateLogButton.prototype, "enablePrivateLog", null);
OnlyDiscordSalesPrivateLogButton = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_buildsalesprivatelogsection.BuildSalesPrivateLogSection))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType
    ])
], OnlyDiscordSalesPrivateLogButton);

//# sourceMappingURL=only-discord-sales.button.js.map