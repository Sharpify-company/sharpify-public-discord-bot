"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DiscordUserEntity", {
    enumerable: true,
    get: function() {
        return DiscordUserEntity;
    }
});
const _typeorm = require("typeorm");
const _cartembedded = require("./cart.embedded");
const _personalinfoembedded = require("./personal-info.embedded");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DiscordUserEntity = class DiscordUserEntity extends _typeorm.BaseEntity {
    static createUser(props) {
        const defaultProps = {
            ...props,
            cart: _cartembedded.CartEmbedded.createDefault(),
            personalInfo: _personalinfoembedded.PersonalInfoEmbedded.createDefault()
        };
        const entity = new DiscordUserEntity();
        Object.assign(entity, defaultProps);
        entity.afterLoad();
    }
    afterLoad() {
        this.cart.discordUser = this;
        this.personalInfo.discordUser = this;
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
], DiscordUserEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)(()=>_cartembedded.CartEmbedded, {
        prefix: false
    }),
    _ts_metadata("design:type", typeof _cartembedded.CartEmbedded === "undefined" ? Object : _cartembedded.CartEmbedded)
], DiscordUserEntity.prototype, "cart", void 0);
_ts_decorate([
    (0, _typeorm.Column)(()=>_personalinfoembedded.PersonalInfoEmbedded, {
        prefix: false
    }),
    _ts_metadata("design:type", typeof _personalinfoembedded.PersonalInfoEmbedded === "undefined" ? Object : _personalinfoembedded.PersonalInfoEmbedded)
], DiscordUserEntity.prototype, "personalInfo", void 0);
_ts_decorate([
    (0, _typeorm.AfterLoad)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], DiscordUserEntity.prototype, "afterLoad", null);
DiscordUserEntity = _ts_decorate([
    (0, _typeorm.Entity)("discordUsers"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], DiscordUserEntity);

//# sourceMappingURL=_discord-user.entity.js.map