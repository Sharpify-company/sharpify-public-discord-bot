"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PlaceOrderButtonComponent", {
    enumerable: true,
    get: function() {
        return PlaceOrderButtonComponent;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _config = require("../../../../../config");
const _lib = require("../../../../../@shared/lib");
const _entities = require("../../../../../@shared/db/entities");
const _sectionmanager = require("../section-manager");
const _types = require("../../../../../@shared/types");
const _usecases = require("../usecases");
const _sharpify = require("../../../../../@shared/sharpify");
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
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
let PlaceOrderButtonComponent = class PlaceOrderButtonComponent {
    async onModalSubmit([interaction]) {
        const discordUser = await _entities.DiscordUserEntity.findOneBy({
            id: interaction.user.id
        });
        if (!discordUser) return await (0, _handlers.HandleDiscordMemberNotFound)({
            interaction
        });
        const firstName = interaction.fields.getTextInputValue("firstNameInput");
        const lastName = interaction.fields.getTextInputValue("lastNameInput");
        const email = interaction.fields.getTextInputValue("emailInput");
        if (!isValidEmail(email)) {
            await interaction.reply({
                content: "Por favor, insira um email válido.",
                flags: [
                    "Ephemeral"
                ]
            });
            return;
        }
        await discordUser.personalInfo.updateInfo({
            firstName,
            lastName,
            email
        });
        const loadinEmoji = await (0, _helpers.FindEmojiHelper)({
            client: this.client,
            name: "Sharpify_carregando"
        });
        await interaction.message?.edit({
            embeds: [
                new _discord.EmbedBuilder().setDescription(`${loadinEmoji} Processando seu pedido...`).setColor(_config.BotConfig.color)
            ],
            components: []
        });
        await interaction.deferReply({
            flags: [
                "Ephemeral"
            ]
        });
        const placeOrderResult = await _sharpify.Sharpify.api.v1.checkout.order.placeOrder({
            storeId: _lib.dotEnv.STORE_ID,
            affiliateCode: null,
            couponCode: discordUser.cart.couponCode || null,
            payment: {
                gatewayMethod: discordUser.cart.gatewayMethod || "PIX"
            },
            customer: {
                firstName: discordUser.personalInfo.firstName,
                lastName: discordUser.personalInfo.lastName,
                email: discordUser.personalInfo.email
            },
            products: discordUser.cart.cartItems.map((item)=>({
                    productId: item.productId,
                    productItemId: item.productItemId,
                    quantity: item.quantity
                }))
        });
        if (!placeOrderResult.success) {
            const result = await this.sectionManagerHandler.setSection({
                discordUserId: interaction.user.id,
                section: "MAIN"
            });
            await interaction.message?.edit(result);
            await interaction.followUp({
                content: `❌ Não foi possível processar seu pedido: ${placeOrderResult.errorName}`,
                flags: [
                    "Ephemeral"
                ]
            });
            return;
        }
        const orderEntity = _entities.OrderEntity.createOrder({
            id: placeOrderResult.data.orderId,
            customerId: discordUser.id,
            deliveryStatus: "PENDING",
            orderProps: placeOrderResult.data.order
        });
        await orderEntity.save();
        if (placeOrderResult.data.isApproved) {
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({
                    content: `Pagamento aprovado! Seu pedido #${orderEntity.id} foi confirmado com sucesso.`
                });
            } else {
                await interaction.followUp({
                    content: `Pagamento aprovado! Seu pedido #${orderEntity.id} foi confirmado com sucesso.`
                });
            }
            // interaction.followUp({
            // 	content: `Pagamento aprovado! Seu pedido #${orderEntity.id} foi confirmado com sucesso.`,
            // 	flags: ["Ephemeral"],
            // });
            return await this.handleOrderApprovedUsecase.execute({
                orderId: orderEntity.id
            });
        }
        const result = await this.sectionManagerHandler.setSection({
            discordUserId: interaction.user.id,
            section: "CHECKOUT",
            orderEntity
        });
        await interaction.message?.edit(result);
        await interaction.followUp({
            content: `✅ pagamento criado com sucesso! .`,
            flags: [
                "Ephemeral"
            ]
        });
    }
    async handleButtonClicked([interaction]) {
        const discordUser = await _entities.DiscordUserEntity.findOneBy({
            id: interaction.user.id
        });
        if (!discordUser) return await (0, _handlers.HandleDiscordMemberNotFound)({
            interaction
        });
        const modal = new _discord.ModalBuilder().setCustomId(`place_order_modal`).setTitle(`Informações do pagador`);
        const defaultFirstName = discordUser.personalInfo.firstName || interaction.user?.displayName?.split(" ")?.at(0);
        const defaultLastName = discordUser.personalInfo.lastName || interaction.user?.username;
        const firstNameInput = new _discord.TextInputBuilder().setCustomId("firstNameInput").setLabel(`Nome`).setStyle(_discord.TextInputStyle.Short).setMinLength(1).setMaxLength(40).setRequired(true);
        if (defaultFirstName) firstNameInput.setValue(defaultFirstName);
        const lastNameInput = new _discord.TextInputBuilder().setCustomId("lastNameInput").setLabel(`Ultimo nome`).setStyle(_discord.TextInputStyle.Short).setMinLength(1).setMaxLength(40).setRequired(true);
        if (defaultLastName) lastNameInput.setValue(defaultLastName);
        const emailInput = new _discord.TextInputBuilder().setCustomId("emailInput").setLabel(`Email`).setStyle(_discord.TextInputStyle.Short).setMinLength(1).setMaxLength(150).setRequired(true);
        if (discordUser.personalInfo.email) emailInput.setValue(discordUser.personalInfo.email);
        modal.setComponents(new _discord.ActionRowBuilder().addComponents([
            firstNameInput
        ]), new _discord.ActionRowBuilder().addComponents([
            lastNameInput
        ]), new _discord.ActionRowBuilder().addComponents([
            emailInput
        ]));
        await interaction.showModal(modal);
    }
    async createButton({ discordUserId }) {
        const discordUser = await _entities.DiscordUserEntity.findOneBy({
            id: discordUserId
        });
        const checkEmoji = await (0, _helpers.FindEmojiHelper)({
            client: this.client,
            name: "Sharpify_aceitar"
        });
        const PlaceOrderButton = new _discord.ButtonBuilder().setCustomId(`place_order`) // unique ID to handle clicks
        .setLabel(`Finalizar compra`) // text on the button
        .setStyle(_discord.ButtonStyle.Success) // gray button, like in the image
        .setDisabled(!discordUser || !discordUser.cart.gatewayMethod);
        checkEmoji && PlaceOrderButton.setEmoji({
            id: checkEmoji.id
        });
        return {
            PlaceOrderButton
        };
    }
    constructor(client, handleOrderApprovedUsecase, sectionManagerHandler){
        this.client = client;
        this.handleOrderApprovedUsecase = handleOrderApprovedUsecase;
        this.sectionManagerHandler = sectionManagerHandler;
    }
};
_ts_decorate([
    (0, _necord.Modal)("place_order_modal"),
    _ts_param(0, (0, _necord.Ctx)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _necord.ModalContext === "undefined" ? Object : _necord.ModalContext
    ]),
    _ts_metadata("design:returntype", Promise)
], PlaceOrderButtonComponent.prototype, "onModalSubmit", null);
_ts_decorate([
    (0, _necord.Button)("place_order"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], PlaceOrderButtonComponent.prototype, "handleButtonClicked", null);
PlaceOrderButtonComponent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_param(2, (0, _common.Inject)((0, _common.forwardRef)(()=>_sectionmanager.SectionManagerHandler))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _usecases.HandleOrderApprovedUsecase === "undefined" ? Object : _usecases.HandleOrderApprovedUsecase,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType
    ])
], PlaceOrderButtonComponent);

//# sourceMappingURL=place-order-button.js.map