"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CancelOrderButtonComponent", {
    enumerable: true,
    get: function() {
        return CancelOrderButtonComponent;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _entities = require("../../../../../@shared/db/entities");
const _sectionmanager = require("../section-manager");
const _types = require("../../../../../@shared/types");
const _usecases = require("../usecases");
const _handlers = require("../../../../../@shared/handlers");
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
let CancelOrderButtonComponent = class CancelOrderButtonComponent {
    async handleButtonClicked([interaction]) {
        await interaction.deferReply({
            flags: "Ephemeral"
        });
        const discordUser = await _entities.DiscordUserEntity.findOneBy({
            id: interaction.user.id
        });
        if (!discordUser) return await (0, _handlers.HandleDiscordMemberNotFound)({
            interaction
        });
        await interaction.editReply({
            content: "✅ | Seu pedido foi cancelado com sucesso.",
            components: [],
            embeds: []
        });
        await this.HandleOrderCancelledUsecase.execute({
            discordUserId: discordUser.id
        });
    }
    async createButton() {
        const cancelEmoji = await (0, _helpers.FindEmojiHelper)({
            client: this.client,
            name: "Sharpify_recusar"
        });
        const CancelCartButton = new _discord.ButtonBuilder().setCustomId(`cancel_order`).setLabel("Cancelar compra").setStyle(_discord.ButtonStyle.Secondary);
        cancelEmoji && CancelCartButton.setEmoji({
            id: cancelEmoji.id
        });
        return {
            CancelCartButton
        };
    }
    constructor(client, sectionManagerHandler, HandleOrderCancelledUsecase){
        this.client = client;
        this.sectionManagerHandler = sectionManagerHandler;
        this.HandleOrderCancelledUsecase = HandleOrderCancelledUsecase;
    }
};
_ts_decorate([
    (0, _necord.Button)("cancel_order"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], CancelOrderButtonComponent.prototype, "handleButtonClicked", null);
CancelOrderButtonComponent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_sectionmanager.SectionManagerHandler))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType,
        typeof _usecases.HandleOrderCancelledUsecase === "undefined" ? Object : _usecases.HandleOrderCancelledUsecase
    ])
], CancelOrderButtonComponent);

//# sourceMappingURL=cancell-order-button.js.map