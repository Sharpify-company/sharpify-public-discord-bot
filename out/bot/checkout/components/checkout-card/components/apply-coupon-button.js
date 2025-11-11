"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplyCouponButtonComponent", {
    enumerable: true,
    get: function() {
        return ApplyCouponButtonComponent;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _entities = require("../../../../../@shared/db/entities");
const _helpers = require("../../../helpers");
const _sectionmanager = require("../section-manager");
const _types = require("../../../../../@shared/types");
const _handlers = require("../../../../../@shared/handlers");
const _helpers1 = require("../../../../../@shared/helpers");
const _sharpify = require("../../../../../@shared/sharpify");
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
let ApplyCouponButtonComponent = class ApplyCouponButtonComponent {
    async onModalSubmit([interaction], productIdAndItemId) {
        const discordUser = await _entities.DiscordUserEntity.findOneBy({
            id: interaction.user.id
        });
        if (!discordUser) return await (0, _handlers.HandleDiscordMemberNotFound)({
            interaction
        });
        const couponCode = interaction.fields.getTextInputValue("couponCodeInput");
        const couponReq = await _sharpify.Sharpify.api.v1.pricing.coupon.validateCoupon({
            code: couponCode
        });
        if (!couponReq.success) {
            return await interaction.reply({
                content: `O código de cupom "${couponCode}" é inválido ou expirou.`,
                flags: [
                    "Ephemeral"
                ]
            });
        }
        discordUser.cart.couponCode = couponCode;
        await discordUser.save();
        await (0, _helpers.ValidateDatabaseCartItemsHelper)({
            discordUserId: discordUser.id
        });
        interaction.deferUpdate();
        const result = await this.sectionManagerHandler.setSection({
            discordUserId: interaction.user.id,
            section: "MAIN"
        });
        await interaction.message?.edit(result);
    }
    async handleButtonClicked([interaction]) {
        const modal = new _discord.ModalBuilder().setCustomId(`apply_coupon_modal`).setTitle(`Aplicar cupom de desconto`);
        const couponCodeInput = new _discord.TextInputBuilder().setCustomId("couponCodeInput").setLabel(`Insira o código do cupom de desconto`).setStyle(_discord.TextInputStyle.Short).setMinLength(1).setMaxLength(50).setRequired(true);
        modal.setComponents(new _discord.ActionRowBuilder().addComponents([
            couponCodeInput
        ]));
        await interaction.showModal(modal);
    }
    async handleRemoveCouopn([interaction]) {
        const discordUser = await _entities.DiscordUserEntity.findOneBy({
            id: interaction.user.id
        });
        if (!discordUser) return await (0, _handlers.HandleDiscordMemberNotFound)({
            interaction
        });
        discordUser.cart.couponCode = null;
        await discordUser.save();
        const result = await this.sectionManagerHandler.setSection({
            discordUserId: interaction.user.id,
            section: "MAIN"
        });
        await interaction.message?.edit(result);
        await interaction.deferUpdate();
    }
    async createButton({ discordUserId }) {
        const discordUser = await _entities.DiscordUserEntity.findOneBy({
            id: discordUserId
        });
        const ticketEmoji = await (0, _helpers1.FindEmojiHelper)({
            client: this.client,
            name: "Sharpify_ticket"
        });
        if (discordUser?.cart.couponCode) {
            const RemoveCouponButton = new _discord.ButtonBuilder().setCustomId(`remove_coupon`) // unique ID to handle clicks
            .setLabel("Remover cupom") // text on the button
            .setStyle(_discord.ButtonStyle.Danger); // gray button, like in the image
            ticketEmoji && RemoveCouponButton.setEmoji({
                id: ticketEmoji.id
            });
            return {
                ApplyCouponButton: RemoveCouponButton
            };
        }
        const ApplyCouponButton = new _discord.ButtonBuilder().setCustomId(`apply_coupon`) // unique ID to handle clicks
        .setLabel("Aplicar cupom") // text on the button
        .setStyle(_discord.ButtonStyle.Secondary); // gray button, like in the image
        ticketEmoji && ApplyCouponButton.setEmoji({
            id: ticketEmoji.id
        });
        return {
            ApplyCouponButton
        };
    }
    constructor(client, sectionManagerHandler){
        this.client = client;
        this.sectionManagerHandler = sectionManagerHandler;
    }
};
_ts_decorate([
    (0, _necord.Modal)("apply_coupon_modal"),
    _ts_param(0, (0, _necord.Ctx)()),
    _ts_param(1, (0, _necord.ModalParam)("productIdAndItemId")),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _necord.ModalContext === "undefined" ? Object : _necord.ModalContext,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplyCouponButtonComponent.prototype, "onModalSubmit", null);
_ts_decorate([
    (0, _necord.Button)("apply_coupon"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplyCouponButtonComponent.prototype, "handleButtonClicked", null);
_ts_decorate([
    (0, _necord.Button)("remove_coupon"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplyCouponButtonComponent.prototype, "handleRemoveCouopn", null);
ApplyCouponButtonComponent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_sectionmanager.SectionManagerHandler))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType
    ])
], ApplyCouponButtonComponent);

//# sourceMappingURL=apply-coupon-button.js.map