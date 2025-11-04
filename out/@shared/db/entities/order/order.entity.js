"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OrderEntity", {
    enumerable: true,
    get: function() {
        return OrderEntity;
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
let OrderEntity = class OrderEntity extends _typeorm.BaseEntity {
    static createOrder(props) {
        const defaultProps = {
            ...props
        };
        const entity = new OrderEntity();
        Object.assign(entity, defaultProps);
        return entity;
    }
    async markAsDelivered() {
        this.deliveryStatus = "DELIVERED";
        await this.save();
    }
    async markAsPreparingDelivery() {
        this.deliveryStatus = "PREPARING_DELIVERY";
        await this.save();
    }
    async updateOrderProps(props) {
        this.orderProps = props;
        await this.save();
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
], OrderEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "orderProps",
        type: "json"
    }),
    _ts_metadata("design:type", typeof _api.OrderProps === "undefined" ? Object : _api.OrderProps)
], OrderEntity.prototype, "orderProps", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "customerId",
        type: "text"
    }),
    _ts_metadata("design:type", String)
], OrderEntity.prototype, "customerId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "deliveryStatus",
        type: "text"
    }),
    _ts_metadata("design:type", typeof OrderEntity === "undefined" || typeof OrderEntity.DeliveryStatus === "undefined" ? Object : OrderEntity.DeliveryStatus)
], OrderEntity.prototype, "deliveryStatus", void 0);
OrderEntity = _ts_decorate([
    (0, _typeorm.Entity)("orders"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], OrderEntity);
(function(OrderEntity) {
    OrderEntity.DeliveryStatus = {
        PENDING: "PENDING",
        PREPARING_DELIVERY: "PREPARING_DELIVERY",
        DELIVERED: "DELIVERED"
    };
})(OrderEntity || (OrderEntity = {}));

//# sourceMappingURL=order.entity.js.map