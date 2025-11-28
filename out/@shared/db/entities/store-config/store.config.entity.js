"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StoreConfigEntity", {
    enumerable: true,
    get: function() {
        return StoreConfigEntity;
    }
});
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
let StoreConfigEntity = class StoreConfigEntity extends _typeorm.BaseEntity {
    static createStore(props) {
        const entity = new StoreConfigEntity();
        entity.updateStoreProps(props);
        entity.applyRolesSettings = [];
        return entity;
    }
    updateStoreProps(props) {
        this.name = props.info.name || "Sem nome";
        this.description = props.info.description || "Sem descrição";
        this.url = props.url || "https://example.com";
        this.image = props.info.image ?? "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
        this.paymentGateways = props.paymentConfigs || [];
    }
    async updateProps(props) {
        this.updateStoreProps(props);
        await this.save();
    }
    async updateRoleSettings(roleSettings) {
        this.applyRolesSettings = roleSettings;
        await this.save();
    }
    constructor(){
        super(), this.id = "DEFAULT";
    }
};
_ts_decorate([
    (0, _typeorm.PrimaryColumn)({
        name: "id",
        type: "text"
    }),
    _ts_metadata("design:type", String)
], StoreConfigEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "name",
        type: "text",
        nullable: false
    }),
    _ts_metadata("design:type", String)
], StoreConfigEntity.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "description",
        type: "text",
        nullable: false
    }),
    _ts_metadata("design:type", String)
], StoreConfigEntity.prototype, "description", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "url",
        type: "text",
        nullable: false
    }),
    _ts_metadata("design:type", String)
], StoreConfigEntity.prototype, "url", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "image",
        type: "text",
        nullable: false
    }),
    _ts_metadata("design:type", String)
], StoreConfigEntity.prototype, "image", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "paymentGateways",
        type: "json",
        nullable: false,
        default: "[]"
    }),
    _ts_metadata("design:type", Array)
], StoreConfigEntity.prototype, "paymentGateways", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "applyRolesSettings",
        type: "json",
        nullable: false,
        default: "[]"
    }),
    _ts_metadata("design:type", Array)
], StoreConfigEntity.prototype, "applyRolesSettings", void 0);
StoreConfigEntity = _ts_decorate([
    (0, _typeorm.Entity)("storeConfig"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], StoreConfigEntity);

//# sourceMappingURL=store.config.entity.js.map