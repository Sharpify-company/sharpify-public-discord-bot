"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HandleExternalEventWs", {
    enumerable: true,
    get: function() {
        return HandleExternalEventWs;
    }
});
const _entities = require("../@shared/db/entities");
const _appwsservice = require("../app.ws.service");
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let HandleExternalEventWs = class HandleExternalEventWs {
    onModuleInit() {
        this.wsClientService.on("commom_services:external_integration_events:external_event_created").subscribe(async ({ payload: { externalEvent: event } })=>{
            const exists = await _entities.ExternalEventsEntity.findOneBy({
                id: event.id
            });
            if (exists) return;
            if (!event.id || !event.contextAggregateId || !event.eventName) return;
            await _entities.ExternalEventsEntity.createExternalEvent({
                id: event.id,
                contextAggregateId: event.contextAggregateId,
                eventName: event.eventName,
                payload: event.payload
            }).save();
        });
    }
    constructor(wsClientService){
        this.wsClientService = wsClientService;
    }
};
HandleExternalEventWs = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _appwsservice.WsClientService === "undefined" ? Object : _appwsservice.WsClientService
    ])
], HandleExternalEventWs);

//# sourceMappingURL=handle-external-event.ws.js.map