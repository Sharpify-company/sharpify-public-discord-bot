"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExternalEventsEntity", {
    enumerable: true,
    get: function() {
        return ExternalEventsEntity;
    }
});
const _api = require("../../../sharpify/api");
const _typeorm = require("typeorm");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ExternalEventsEntity = class ExternalEventsEntity extends _typeorm.BaseEntity {
    static createExternalEvent(props) {
        const defaultProps = {
            ...props
        };
        const entity = new ExternalEventsEntity();
        Object.assign(entity, defaultProps);
        return entity;
    }
    constructor(){
        super();
    }
};
_ts_decorate([
    (0, _typeorm.PrimaryColumn)({
        name: "id",
        type: "text"
    }),
    _ts_metadata("design:type", String)
], ExternalEventsEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "eventName",
        type: "text"
    }),
    _ts_metadata("design:type", typeof _api.ExternalEventsProps === "undefined" || typeof _api.ExternalEventsProps.EventNameEnum === "undefined" ? Object : _api.ExternalEventsProps.EventNameEnum)
], ExternalEventsEntity.prototype, "eventName", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "contextAggregateId",
        type: "text"
    }),
    _ts_metadata("design:type", String)
], ExternalEventsEntity.prototype, "contextAggregateId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "payload",
        type: "json"
    }),
    _ts_metadata("design:type", Object)
], ExternalEventsEntity.prototype, "payload", void 0);
ExternalEventsEntity = _ts_decorate([
    (0, _typeorm.Entity)("externalEvents"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], ExternalEventsEntity);

//# sourceMappingURL=external-events.entity.js.map