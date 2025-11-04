"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WokerModule", {
    enumerable: true,
    get: function() {
        return WokerModule;
    }
});
const _common = require("@nestjs/common");
const _consumeexternaleventworker = require("./consume-external-event.worker");
const _handleexternaleventworker = require("./handle-external-event.worker");
const _usecasesmodule = require("./usecases/usecases.module");
const _handleorderdeliveryworker = require("./handle-order-delivery.worker");
const _expireorderworker = require("./expire-order.worker");
const _revalidatestoreconfigworker = require("./revalidate-store-config.worker");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let WokerModule = class WokerModule {
};
WokerModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _usecasesmodule.UsecasesModule
        ],
        controllers: [],
        providers: [
            _consumeexternaleventworker.ConsumeExternalEventWorker,
            _handleexternaleventworker.HandleExternalEventWorker,
            _handleorderdeliveryworker.HandleOrderDeliveryWorker,
            _expireorderworker.ExpireOrderWorker,
            _revalidatestoreconfigworker.RevalidateStoreConfigWorker
        ]
    })
], WokerModule);

//# sourceMappingURL=worker.module.js.map