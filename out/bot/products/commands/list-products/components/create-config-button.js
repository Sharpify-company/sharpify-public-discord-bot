"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateConfigButtonComponent", {
    enumerable: true,
    get: function() {
        return CreateConfigButtonComponent;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _lib = require("../../../../../@shared/lib");
const _helpers = require("../../../../../@shared/helpers");
const _memorycreateconfig = require("../memory-create-config");
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
let CreateConfigButtonComponent = class CreateConfigButtonComponent {
    async onModalSubmit([interaction], productId) {
        const color = interaction.fields.getTextInputValue("colorInput");
        if (!/^#([A-Fa-f0-9]{1,6})$/.test(color)) {
            return interaction.reply({
                content: `❌ Cor inválida! Por favor, insira um valor hexadecimal válido. Exemplo: #338bff. Com 6 caracteres após o #.`,
                flags: [
                    "Ephemeral"
                ]
            });
        }
        _memorycreateconfig.MemoryCreateConfig.set(productId, {
            color
        });
        await interaction?.reply({
            content: `✅ Configuração criada com sucesso!\nCor da Badge: ${color}`,
            flags: [
                "Ephemeral"
            ]
        });
    }
    async handleButtonClicked([interaction], productId) {
        const Config = _memorycreateconfig.MemoryCreateConfig.get(productId);
        const modal = new _discord.ModalBuilder().setCustomId(`config_product_creation_modal${productId}`).setTitle(`Configurar criação do produto`);
        const badgeColor = new _discord.TextInputBuilder().setCustomId("colorInput").setLabel(`Cor da Badge (Hexadecimal)`).setStyle(_discord.TextInputStyle.Short).setMinLength(1).setMaxLength(40).setRequired(true);
        badgeColor.setValue(Config?.color || _lib.dotEnv.DEFAULT_COLOR || "#338bff");
        modal.setComponents(new _discord.ActionRowBuilder().addComponents([
            badgeColor
        ]));
        await interaction.showModal(modal);
    }
    async createButton({ productId }) {
        const devEmoji = await (0, _helpers.FindEmojiHelper)({
            client: this.client,
            name: "Sharpify_dev"
        });
        const CreateProductConfigButton = new _discord.ButtonBuilder().setCustomId(`config_product_creation${productId}`) // unique ID to handle clicks
        .setLabel(`Configurar criação do produto`) // text on the button
        .setStyle(_discord.ButtonStyle.Secondary); // gray button, like in the image
        devEmoji && CreateProductConfigButton.setEmoji({
            id: devEmoji.id
        });
        return {
            CreateProductConfigButton
        };
    }
    constructor(client){
        this.client = client;
    }
};
_ts_decorate([
    (0, _necord.Modal)("config_product_creation_modal:productId"),
    _ts_param(0, (0, _necord.Ctx)()),
    _ts_param(1, (0, _necord.ModalParam)("productId")),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _necord.ModalContext === "undefined" ? Object : _necord.ModalContext,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CreateConfigButtonComponent.prototype, "onModalSubmit", null);
_ts_decorate([
    (0, _necord.Button)("config_product_creation:productId"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_param(1, (0, _necord.ComponentParam)("productId")),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CreateConfigButtonComponent.prototype, "handleButtonClicked", null);
CreateConfigButtonComponent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client
    ])
], CreateConfigButtonComponent);

//# sourceMappingURL=create-config-button.js.map