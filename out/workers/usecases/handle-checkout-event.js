"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HandleCheckoutEvent", {
    enumerable: true,
    get: function() {
        return HandleCheckoutEvent;
    }
});
const _entities = require("../../@shared/db/entities");
const _usecases = require("../../bot/checkout/components/checkout-card/usecases");
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
let HandleCheckoutEvent = class HandleCheckoutEvent {
    async create(externalEventEntity) {
        const payloadOrder = externalEventEntity.payload;
        const orderEntity = await _entities.OrderEntity.findOneBy({
            id: externalEventEntity.contextAggregateId
        });
        if (!orderEntity) {
            if (payloadOrder.customer.info?.platform?.discordId) {
                await this.handleOrderApprovedUsecase.giveRoleToUser({
                    discordUserId: payloadOrder.customer.info.platform.discordId
                });
            }
            await this.handleOrderApprovedUsecase.sendPublicSalesLog({
                orderProps: payloadOrder
            });
            await this.handleOrderApprovedUsecase.sendPrivateSalesLog({
                orderProps: payloadOrder
            });
            return;
        }
        if (orderEntity.deliveryStatus !== "PENDING") return;
        if (externalEventEntity.eventName === "ORDER_APPROVED") {
            await orderEntity.updateOrderProps(payloadOrder);
            await this.handleOrderApprovedUsecase.execute({
                orderId: orderEntity.id
            });
        }
        if (externalEventEntity.eventName === "ORDER_CANCELLED") {
            await orderEntity.updateOrderProps(payloadOrder);
            this.HandleOrderCancelledUsecase.execute({
                discordUserId: orderEntity.customerId
            });
        }
    }
    constructor(client, handleOrderApprovedUsecase, HandleOrderCancelledUsecase){
        this.client = client;
        this.handleOrderApprovedUsecase = handleOrderApprovedUsecase;
        this.HandleOrderCancelledUsecase = HandleOrderCancelledUsecase;
    }
};
HandleCheckoutEvent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _usecases.HandleOrderApprovedUsecase === "undefined" ? Object : _usecases.HandleOrderApprovedUsecase,
        typeof _usecases.HandleOrderCancelledUsecase === "undefined" ? Object : _usecases.HandleOrderCancelledUsecase
    ])
], HandleCheckoutEvent);

//# sourceMappingURL=handle-checkout-event.js.map