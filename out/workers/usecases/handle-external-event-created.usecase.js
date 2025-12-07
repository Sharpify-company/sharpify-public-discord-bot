"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HandleExternalEventCreatedUsecase", {
    enumerable: true,
    get: function() {
        return HandleExternalEventCreatedUsecase;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
require("necord");
const _handleproductevent = require("./handle-product-event");
const _handlecheckoutevent = require("./handle-checkout-event");
const _handlefeedbackevent = require("./handle-feedback-event");
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
let HandleExternalEventCreatedUsecase = class HandleExternalEventCreatedUsecase {
    async execute(event) {
        if (event.eventName === "PRODUCT_DELETED" || event.eventName === "PRODUCT_UPDATED") {
            await this.handleProductEvent.create(event);
        }
        if (event.eventName === "ORDER_APPROVED" || event.eventName === "ORDER_CANCELLED") {
            await this.handleCheckoutEvent.create(event);
        }
        if (event.eventName === "ORDER_FEEDBACK_RECEIVED") {
            await this.handleFeedbackEvent.create(event);
        }
        await event.remove();
    }
    constructor(client, handleProductEvent, handleCheckoutEvent, handleFeedbackEvent){
        this.client = client;
        this.handleProductEvent = handleProductEvent;
        this.handleCheckoutEvent = handleCheckoutEvent;
        this.handleFeedbackEvent = handleFeedbackEvent;
    }
};
HandleExternalEventCreatedUsecase = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _handleproductevent.HandleProductEvent === "undefined" ? Object : _handleproductevent.HandleProductEvent,
        typeof _handlecheckoutevent.HandleCheckoutEvent === "undefined" ? Object : _handlecheckoutevent.HandleCheckoutEvent,
        typeof _handlefeedbackevent.HandleFeedbackEvent === "undefined" ? Object : _handlefeedbackevent.HandleFeedbackEvent
    ])
], HandleExternalEventCreatedUsecase);

//# sourceMappingURL=handle-external-event-created.usecase.js.map