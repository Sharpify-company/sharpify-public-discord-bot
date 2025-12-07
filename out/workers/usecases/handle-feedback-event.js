"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HandleFeedbackEvent", {
    enumerable: true,
    get: function() {
        return HandleFeedbackEvent;
    }
});
const _entities = require("../../@shared/db/entities");
const _handleorderfeedbacksentusecase = require("../../bot/checkout/components/checkout-card/usecases/handle-order-feedback-sent/_handle-order-feedback-sent.usecase");
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
let HandleFeedbackEvent = class HandleFeedbackEvent {
    async create(externalEventEntity) {
        const payloadOrder = externalEventEntity.payload;
        const orderEntity = await _entities.OrderEntity.findOneBy({
            id: externalEventEntity.contextAggregateId
        });
        if (!orderEntity) {
            await this.handleOrderFeedbackSentUsecase.sendPrivateLog({
                order: payloadOrder,
                discordUserId: payloadOrder.customer?.info?.platform.discordId
            });
            await this.handleOrderFeedbackSentUsecase.sendPublicLog({
                order: payloadOrder,
                discordUserId: payloadOrder.customer?.info?.platform.discordId
            });
            return;
        }
        if (externalEventEntity.eventName === "ORDER_FEEDBACK_RECEIVED") {
            await orderEntity.updateOrderProps(payloadOrder);
            await this.handleOrderFeedbackSentUsecase.sendPrivateLog({
                order: orderEntity.orderProps,
                discordUserId: orderEntity.customerId
            });
            await this.handleOrderFeedbackSentUsecase.sendPublicLog({
                order: orderEntity.orderProps,
                discordUserId: orderEntity.customerId
            });
        }
    }
    constructor(client, handleOrderFeedbackSentUsecase){
        this.client = client;
        this.handleOrderFeedbackSentUsecase = handleOrderFeedbackSentUsecase;
    }
};
HandleFeedbackEvent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _handleorderfeedbacksentusecase.HandleOrderFeedbackSentUsecase === "undefined" ? Object : _handleorderfeedbacksentusecase.HandleOrderFeedbackSentUsecase
    ])
], HandleFeedbackEvent);

//# sourceMappingURL=handle-feedback-event.js.map