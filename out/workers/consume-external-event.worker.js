"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConsumeExternalEventWorker", {
    enumerable: true,
    get: function() {
        return ConsumeExternalEventWorker;
    }
});
const _entities = require("../@shared/db/entities");
const _sharpify = require("../@shared/sharpify");
const _common = require("@nestjs/common");
const _schedule = require("@nestjs/schedule");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ConsumeExternalEventWorker = class ConsumeExternalEventWorker {
    handleCron() {
        this.execute();
    }
    async execute() {
        const req = await _sharpify.Sharpify.api.v1.commomServices.externalEvents.listPendingEvents();
        if (!req.success) return console.log("Error fetching events:", req.errorName);
        for (const event of req.data.events){
            const exists = await _entities.ExternalEventsEntity.findOneBy({
                id: event.id
            });
            if (exists) continue;
            if (!event.id || !event.contextAggregateId || !event.eventName) return;
            await _entities.ExternalEventsEntity.createExternalEvent({
                id: event.id,
                contextAggregateId: event.contextAggregateId,
                eventName: event.eventName,
                payload: event.payload
            }).save();
        }
        await _sharpify.Sharpify.api.v1.commomServices.externalEvents.markAsReceived({
            ids: req.data.events.map((e)=>e.id)
        });
    }
};
_ts_decorate([
    (0, _schedule.Cron)("*/15 * * * * *"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ConsumeExternalEventWorker.prototype, "handleCron", null);
ConsumeExternalEventWorker = _ts_decorate([
    (0, _common.Injectable)()
], ConsumeExternalEventWorker);

//# sourceMappingURL=consume-external-event.worker.js.map