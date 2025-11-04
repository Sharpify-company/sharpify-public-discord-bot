"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HandleProductEvent", {
    enumerable: true,
    get: function() {
        return HandleProductEvent;
    }
});
const _entities = require("../../@shared/db/entities");
const _components = require("../../bot/checkout/components");
const _common = require("@nestjs/common");
const _discord = require("discord.js");
require("necord");
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
let HandleProductEvent = class HandleProductEvent {
    async create(externalEventEntity) {
        const payloadProduct = externalEventEntity.payload;
        const productEntity = await _entities.ProductEntity.findOneBy({
            id: externalEventEntity.contextAggregateId
        });
        if (!productEntity) return;
        if (externalEventEntity.eventName === "PRODUCT_DELETED") {
            for (const channelLiked of productEntity.channelsLinked){
                const channel = await this.client.channels.fetch(channelLiked.channelId).catch(()=>null);
                if (!channel || !channel.isTextBased()) continue;
                const message = await channel.messages.fetch(channelLiked.messageId).catch(()=>null);
                if (!message) continue;
                await message.delete();
            }
            await productEntity.remove();
        } else if (externalEventEntity.eventName === "PRODUCT_UPDATED") {
            for (const channelLiked of productEntity.channelsLinked){
                const channel = await this.client.channels.fetch(channelLiked.channelId).catch(()=>null);
                if (!channel || !channel.isTextBased()) continue;
                const message = await channel.messages.fetch(channelLiked.messageId).catch(()=>null);
                if (!message) continue;
                const reply = await this.productCardComponent.getProductCard(payloadProduct);
                await message.edit({
                    embeds: [
                        reply.normalEmmbed
                    ],
                    components: [
                        reply.normalPurchaseButton
                    ]
                });
            }
            await productEntity.updateProps(payloadProduct);
        }
    }
    constructor(client, productCardComponent){
        this.client = client;
        this.productCardComponent = productCardComponent;
    }
};
HandleProductEvent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _components.ProductCardComponent === "undefined" ? Object : _components.ProductCardComponent
    ])
], HandleProductEvent);

//# sourceMappingURL=handle-product-event.js.map