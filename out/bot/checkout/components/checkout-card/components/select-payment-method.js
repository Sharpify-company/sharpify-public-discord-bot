"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SelectPaymentMethodComponent", {
    enumerable: true,
    get: function() {
        return SelectPaymentMethodComponent;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _entities = require("../../../../../@shared/db/entities");
const _sectionmanager = require("../section-manager");
const _types = require("../../../../../@shared/types");
const _sharpify = require("../../../../../@shared/sharpify");
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
let SelectPaymentMethodComponent = class SelectPaymentMethodComponent {
    async handleItemSelected([interaction], selected) {
        const discordUser = await _entities.DiscordUserEntity.findOneBy({
            id: interaction.user.id
        });
        if (discordUser) {
            discordUser.cart.gatewayMethod = selected[0];
            await discordUser.save();
        }
        const result = await this.sectionManagerHandler.setSection({
            discordUserId: interaction.user.id,
            section: "MAIN"
        });
        await interaction.deferUpdate();
        await interaction.message.edit(result);
    }
    async createSelect({ discordUserId }) {
        const discordUser = await _entities.DiscordUserEntity.findOneBy({
            id: discordUserId
        });
        const storeConfig = await (0, _sharpify.getLocalStoreConfig)();
        const defaultGatewayMethod = discordUser?.cart.gatewayMethod || storeConfig.paymentGateways.at(0)?.gatewayMethod || null;
        if (discordUser && defaultGatewayMethod) {
            await discordUser?.cart.updateGatewayMethod(defaultGatewayMethod);
        }
        const options = await Promise.all(storeConfig.paymentGateways.map(async (item, index)=>{
            const result = {
                label: "Metodo desconhecido",
                description: `Metodo desconhecido.`,
                value: item.gatewayMethod,
                default: defaultGatewayMethod === item.gatewayMethod
            };
            if (item.gatewayMethod === "PIX") {
                const pixEmoji = await (0, _helpers.FindEmojiHelper)({
                    client: this.client,
                    name: "Sharpify_pix"
                });
                result.emoji = {
                    id: pixEmoji?.id
                };
                result.label = "Método de pagamento PIX";
                result.description = `Pague via PIX utilizando nosso gerenciador de pagamentos.`;
            } else if (item.gatewayMethod === "EFI_PAY_PREFERENCE") {
                const efiEmoji = await (0, _helpers.FindEmojiHelper)({
                    client: this.client,
                    name: "Sharpify_efibank"
                });
                result.emoji = {
                    id: efiEmoji?.id
                };
                result.label = "Link de pagamento EFI Bank";
                result.description = `Pague via cartão de crédito utilizando nosso gerenciador de pagamentos.`;
            }
            return result;
        }));
        const selectMenu = new _discord.StringSelectMenuBuilder().setCustomId(`gateway_method_selected`).setPlaceholder("Selecione o método de pagamento").addOptions(options);
        const selectPaymentMethod = new _discord.ActionRowBuilder().addComponents(selectMenu);
        return {
            selectPaymentMethod
        };
    }
    constructor(client, sectionManagerHandler){
        this.client = client;
        this.sectionManagerHandler = sectionManagerHandler;
    }
};
_ts_decorate([
    (0, _necord.StringSelect)("gateway_method_selected"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_param(1, (0, _necord.SelectedStrings)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _necord.StringSelectContext === "undefined" ? Object : _necord.StringSelectContext,
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], SelectPaymentMethodComponent.prototype, "handleItemSelected", null);
SelectPaymentMethodComponent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_sectionmanager.SectionManagerHandler))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType
    ])
], SelectPaymentMethodComponent);

//# sourceMappingURL=select-payment-method.js.map