"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SelectSetProductOnChannel", {
    enumerable: true,
    get: function() {
        return SelectSetProductOnChannel;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _components = require("../../../../checkout/components");
const _sharpify = require("../../../../../@shared/sharpify");
const _entities = require("../../../../../@shared/db/entities");
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
let SelectSetProductOnChannel = class SelectSetProductOnChannel {
    async handleChannelSelected([interaction], selected, productId) {
        const channel = interaction.guild?.channels.cache.get(selected?.at(0).id);
        if (!channel?.isTextBased()) {
            return interaction.reply({
                content: "O canal selecionado não é um canal de texto válido.",
                flags: [
                    "Ephemeral"
                ]
            });
        }
        const product = await _sharpify.Sharpify.api.v1.catalog.product.get({
            id: productId,
            includeNonListed: true
        });
        if (!product.success) {
            return interaction.reply({
                content: `Error ao buscar produto: ${product.errorName}`,
                flags: [
                    "Ephemeral"
                ]
            });
        }
        let productEntity = await _entities.ProductEntity.findOneBy({
            id: product.data.product.id
        });
        if (!productEntity) {
            productEntity = _entities.ProductEntity.createProduct({
                id: product.data.product.id,
                productProps: product.data.product
            });
            await productEntity.save();
        }
        const reply = await this.productCardComponent.sendProductCardToChannel({
            channel: channel,
            product: product.data.product
        });
        await productEntity.setChannelLinked({
            channelId: channel.id,
            messageId: reply.id
        });
        interaction.reply({
            content: "Produto setado no canal com sucesso!",
            flags: [
                "Ephemeral"
            ]
        });
    }
    createSelectChannel({ interaction, product }) {
        const selectMenu = new _discord.ChannelSelectMenuBuilder().setCustomId(`select_set_product_on_channel${product.id}`).setPlaceholder("Selecione qual canal colocar o produto...").setMaxValues(1).setMinValues(1);
        return new _discord.ActionRowBuilder().addComponents(selectMenu);
    }
    constructor(productCardComponent){
        this.productCardComponent = productCardComponent;
    }
};
_ts_decorate([
    (0, _necord.ChannelSelect)("select_set_product_on_channel:productId"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_param(1, (0, _necord.SelectedChannels)()),
    _ts_param(2, (0, _necord.ComponentParam)("productId")),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _necord.StringSelectContext === "undefined" ? Object : _necord.StringSelectContext,
        typeof _necord.ISelectedChannels === "undefined" ? Object : _necord.ISelectedChannels,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], SelectSetProductOnChannel.prototype, "handleChannelSelected", null);
SelectSetProductOnChannel = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _components.ProductCardComponent === "undefined" ? Object : _components.ProductCardComponent
    ])
], SelectSetProductOnChannel);

//# sourceMappingURL=select-set-product-on-channel.js.map