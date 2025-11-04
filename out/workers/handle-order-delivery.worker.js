"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HandleOrderDeliveryWorker", {
    enumerable: true,
    get: function() {
        return HandleOrderDeliveryWorker;
    }
});
const _entities = require("../@shared/db/entities");
const _common = require("@nestjs/common");
const _schedule = require("@nestjs/schedule");
const _handledelivertodiscorduserprivate = require("./usecases/handle-deliver-to-discord-user-private");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let HandleOrderDeliveryWorker = class HandleOrderDeliveryWorker {
    handleCron() {
        this.execute();
    }
    async execute() {
        const pendingDeliveringOrder = await _entities.OrderEntity.findBy({
            deliveryStatus: "PREPARING_DELIVERY"
        });
        for (const orderEntity of pendingDeliveringOrder){
            await this.handleDeliverToDiscordUserPrivate.execute({
                orderEntity
            });
        }
    }
    constructor(handleDeliverToDiscordUserPrivate){
        this.handleDeliverToDiscordUserPrivate = handleDeliverToDiscordUserPrivate;
    }
};
_ts_decorate([
    (0, _schedule.Cron)("*/3 * * * * *"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], HandleOrderDeliveryWorker.prototype, "handleCron", null);
HandleOrderDeliveryWorker = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _handledelivertodiscorduserprivate.HandleDeliverToDiscordUserPrivate === "undefined" ? Object : _handledelivertodiscorduserprivate.HandleDeliverToDiscordUserPrivate
    ])
], HandleOrderDeliveryWorker);

//# sourceMappingURL=handle-order-delivery.worker.js.map