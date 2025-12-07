"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsecasesModule", {
    enumerable: true,
    get: function() {
        return UsecasesModule;
    }
});
const _common = require("@nestjs/common");
const _handleproductevent = require("./handle-product-event");
const _handledelivertodiscorduserprivate = require("./handle-deliver-to-discord-user-private");
const _handlecheckoutevent = require("./handle-checkout-event");
const _handleexternaleventcreatedusecase = require("./handle-external-event-created.usecase");
const _handlefeedbackevent = require("./handle-feedback-event");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UsecasesModule = class UsecasesModule {
};
UsecasesModule = _ts_decorate([
    (0, _common.Global)(),
    (0, _common.Module)({
        imports: [],
        controllers: [],
        providers: [
            _handleproductevent.HandleProductEvent,
            _handledelivertodiscorduserprivate.HandleDeliverToDiscordUserPrivate,
            _handlecheckoutevent.HandleCheckoutEvent,
            _handleexternaleventcreatedusecase.HandleExternalEventCreatedUsecase,
            _handlefeedbackevent.HandleFeedbackEvent
        ],
        exports: [
            _handleproductevent.HandleProductEvent,
            _handledelivertodiscorduserprivate.HandleDeliverToDiscordUserPrivate,
            _handlecheckoutevent.HandleCheckoutEvent,
            _handleexternaleventcreatedusecase.HandleExternalEventCreatedUsecase,
            _handlefeedbackevent.HandleFeedbackEvent
        ]
    })
], UsecasesModule);

//# sourceMappingURL=usecases.module.js.map