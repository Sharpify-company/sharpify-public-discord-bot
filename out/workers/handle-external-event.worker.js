"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HandleExternalEventWorker", {
    enumerable: true,
    get: function() {
        return HandleExternalEventWorker;
    }
});
const _entities = require("../@shared/db/entities");
const _common = require("@nestjs/common");
const _schedule = require("@nestjs/schedule");
const _usecases = require("./usecases");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let HandleExternalEventWorker = class HandleExternalEventWorker {
    handleCron() {
        this.execute();
    }
    async execute() {
        const pendingEvents = await _entities.ExternalEventsEntity.find();
        for (const event of pendingEvents){
            await this.handleExternalEventCreatedUsecase.execute(event);
        }
    }
    constructor(handleExternalEventCreatedUsecase){
        this.handleExternalEventCreatedUsecase = handleExternalEventCreatedUsecase;
    }
};
_ts_decorate([
    (0, _schedule.Cron)("*/5 * * * * *"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], HandleExternalEventWorker.prototype, "handleCron", null);
HandleExternalEventWorker = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usecases.HandleExternalEventCreatedUsecase === "undefined" ? Object : _usecases.HandleExternalEventCreatedUsecase
    ])
], HandleExternalEventWorker);

//# sourceMappingURL=handle-external-event.worker.js.map