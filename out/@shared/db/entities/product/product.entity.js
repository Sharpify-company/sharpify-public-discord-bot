"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductEntity", {
    enumerable: true,
    get: function() {
        return ProductEntity;
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
let ProductEntity = class ProductEntity extends _typeorm.BaseEntity {
    static createProduct(props) {
        const defaultProps = {
            ...props,
            channelsLinked: props.channelsLinked || []
        };
        const entity = new ProductEntity();
        Object.assign(entity, defaultProps);
        return entity;
    }
    async updateProps(props) {
        this.productProps = props;
        await this.save();
    }
    async setChannelLinked({ channelId, messageId }) {
        const existing = this.channelsLinked.find((c)=>c.channelId === channelId);
        if (existing) {
            existing.messageId = messageId;
        } else {
            this.channelsLinked.push({
                channelId,
                messageId
            });
        }
        this.save();
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
], ProductEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "orderProps",
        type: "json"
    }),
    _ts_metadata("design:type", typeof _api.ProductProps === "undefined" ? Object : _api.ProductProps)
], ProductEntity.prototype, "productProps", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "channelsLinked",
        type: "json"
    }),
    _ts_metadata("design:type", Array)
], ProductEntity.prototype, "channelsLinked", void 0);
ProductEntity = _ts_decorate([
    (0, _typeorm.Entity)("products"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], ProductEntity);

//# sourceMappingURL=product.entity.js.map