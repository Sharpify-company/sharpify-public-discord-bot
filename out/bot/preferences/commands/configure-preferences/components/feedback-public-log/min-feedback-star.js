"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MinFeedbackStarButton", {
    enumerable: true,
    get: function() {
        return MinFeedbackStarButton;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _entities = require("../../../../../../@shared/db/entities");
const _types = require("../../../../../../@shared/types");
const _handlers = require("../../../../../../@shared/handlers");
const _sharpify = require("../../../../../../@shared/sharpify");
const _buildfeedbackpubliclogsection = require("./_build-feedback-public-log-section");
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
let MinFeedbackStarButton = class MinFeedbackStarButton {
    async onModalSubmit([interaction]) {
        const discordUser = await _entities.DiscordUserEntity.findOneBy({
            id: interaction.user.id
        });
        if (!discordUser) return await (0, _handlers.HandleDiscordMemberNotFound)({
            interaction
        });
        const minStar = parseInt(interaction.fields.getTextInputValue("minStar"));
        if (isNaN(minStar) || minStar < 1 || minStar > 5) {
            return await interaction.reply({
                content: `Por favor, insira um número válido entre 1 e 5 para a estrela mínima.`,
                ephemeral: true
            });
        }
        const store = await (0, _sharpify.getLocalStoreConfig)();
        const preferences = store.getPreferences();
        preferences.feedbackPublicLog.minFeedbackStar = minStar;
        await store.savePreferences(preferences);
        await interaction.reply({
            content: `Estrela mínima de feedback público atualizada para ${minStar}⭐ com sucesso! Quando um feedback for recebido com pelo menos ${minStar}⭐, ele não registrado em nenhum canal.`,
            flags: [
                "Ephemeral"
            ]
        });
    }
    async button([interaction]) {
        const minFeedbackStar = (await (0, _sharpify.getLocalStoreConfig)()).getPreferences().feedbackPublicLog.minFeedbackStar || 4;
        const modal = new _discord.ModalBuilder().setCustomId(`edit_min_feedback_star_public_log_modal`).setTitle(`Aplicar Estrela Mínima de Feedback. 1⭐ - 5⭐`);
        const starInput = new _discord.TextInputBuilder().setCustomId("minStar").setLabel(`Insira o número mínimo de estrelas`).setStyle(_discord.TextInputStyle.Short).setValue(minFeedbackStar.toString()).setMinLength(1).setMaxLength(50).setRequired(true);
        modal.setComponents(new _discord.ActionRowBuilder().addComponents([
            starInput
        ]));
        await interaction.showModal(modal);
    }
    async createButton() {
        const minFeedbackStar = (await (0, _sharpify.getLocalStoreConfig)()).getPreferences().feedbackPublicLog.minFeedbackStar || 4;
        let minFeedbackStarButton = new _discord.ButtonBuilder().setCustomId("edit_min_feedback_star_public_log").setLabel(`Editar estrela mínima | Atual: ${minFeedbackStar}⭐`).setStyle(_discord.ButtonStyle.Secondary);
        return {
            minFeedbackStarButton
        };
    }
    constructor(client, buildFeedbackPublicLogSection){
        this.client = client;
        this.buildFeedbackPublicLogSection = buildFeedbackPublicLogSection;
    }
};
_ts_decorate([
    (0, _necord.Modal)("edit_min_feedback_star_public_log_modal"),
    _ts_param(0, (0, _necord.Ctx)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _necord.ModalContext === "undefined" ? Object : _necord.ModalContext
    ]),
    _ts_metadata("design:returntype", Promise)
], MinFeedbackStarButton.prototype, "onModalSubmit", null);
_ts_decorate([
    (0, _necord.Button)("edit_min_feedback_star_public_log"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], MinFeedbackStarButton.prototype, "button", null);
MinFeedbackStarButton = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_buildfeedbackpubliclogsection.BuildFeedbackPublicLogSection))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType
    ])
], MinFeedbackStarButton);

//# sourceMappingURL=min-feedback-star.js.map