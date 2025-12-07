"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SelectSalesPublicLogChannel", {
    enumerable: true,
    get: function() {
        return SelectSalesPublicLogChannel;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _sharpify = require("../../../../../../@shared/sharpify");
const _buildpreferenceconfigure = require("../_build-preference-configure");
const _types = require("../../../../../../@shared/types");
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
let SelectSalesPublicLogChannel = class SelectSalesPublicLogChannel {
    async handleChannelSelected([interaction], selected) {
        const channel = interaction.guild?.channels.cache.get(selected?.at(0).id);
        if (!channel?.isTextBased()) {
            return interaction.reply({
                content: "O canal selecionado não é um canal de texto válido.",
                flags: [
                    "Ephemeral"
                ]
            });
        }
        const store = await (0, _sharpify.getLocalStoreConfig)();
        const preferences = store.getPreferences();
        preferences.publicLogSales.channelId = channel.id;
        await store.savePreferences(preferences);
        await interaction.update(await this.buildPreferenceConfigure.build({
            section: "SALES_PUBLIC_LOG"
        }));
    }
    async createSelectChannel() {
        const store = await (0, _sharpify.getLocalStoreConfig)();
        const preferences = store.getPreferences();
        const selectMenu = new _discord.ChannelSelectMenuBuilder().setCustomId(`select_sales_public_log_channel`).setPlaceholder("Selecione qual canal o log publico vai ser mandado...").setMaxValues(1).setMinValues(1);
        const defaultPlaceholder = "Selecione qual canal o log publico vai ser mandado...";
        if (preferences.publicLogSales.channelId) {
            const channel = await this.client.channels.fetch(preferences.publicLogSales.channelId).catch(()=>null);
            if (channel) {
                selectMenu.setPlaceholder(`✅ Canal selecionado: #${channel.name}`);
            } else selectMenu.setPlaceholder(defaultPlaceholder);
        } else {
            selectMenu.setPlaceholder(defaultPlaceholder);
        }
        return new _discord.ActionRowBuilder().addComponents(selectMenu);
    }
    constructor(buildPreferenceConfigure, client){
        this.buildPreferenceConfigure = buildPreferenceConfigure;
        this.client = client;
    }
};
_ts_decorate([
    (0, _necord.ChannelSelect)("select_sales_public_log_channel"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_param(1, (0, _necord.SelectedChannels)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _necord.StringSelectContext === "undefined" ? Object : _necord.StringSelectContext,
        typeof _necord.ISelectedChannels === "undefined" ? Object : _necord.ISelectedChannels
    ]),
    _ts_metadata("design:returntype", Promise)
], SelectSalesPublicLogChannel.prototype, "handleChannelSelected", null);
SelectSalesPublicLogChannel = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)((0, _common.forwardRef)(()=>_buildpreferenceconfigure.BuildPreferenceConfigure))),
    _ts_param(1, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType,
        typeof _discord.Client === "undefined" ? Object : _discord.Client
    ])
], SelectSalesPublicLogChannel);

//# sourceMappingURL=select-public-log-channel-section.js.map