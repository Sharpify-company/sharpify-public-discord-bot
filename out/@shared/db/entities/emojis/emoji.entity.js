"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmojiEntity", {
    enumerable: true,
    get: function() {
        return EmojiEntity;
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
let EmojiEntity = class EmojiEntity extends _typeorm.BaseEntity {
    static createEmoji(props) {
        const entity = new EmojiEntity();
        Object.assign(entity, props);
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
], EmojiEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: "name",
        type: "text",
        nullable: false
    }),
    _ts_metadata("design:type", typeof EmojiEntity === "undefined" || typeof EmojiEntity.EmojiNameEnum === "undefined" ? Object : EmojiEntity.EmojiNameEnum)
], EmojiEntity.prototype, "name", void 0);
EmojiEntity = _ts_decorate([
    (0, _typeorm.Entity)("Emojis"),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], EmojiEntity);
(function(EmojiEntity) {
    EmojiEntity.EmojiNameEnum = {
        Sharpify_aceitar: "Sharpify_aceitar",
        Sharpify_ticket: "Sharpify_ticket",
        Sharpify_recusar: "Sharpify_recusar",
        Sharpify_pix: "Sharpify_pix",
        Sharpify_letsgo: "Sharpify_letsgo",
        Sharpify_money: "Sharpify_money",
        Sharpify_carrinho: "Sharpify_carrinho",
        Sharpify_carregando: "Sharpify_carregando",
        Sharpify_direita: "Sharpify_direita",
        Sharpify_caixa: "Sharpify_caixa",
        Sharpify_efibank: "Sharpify_efibank",
        Sharpify_dev: "Sharpify_dev"
    };
})(EmojiEntity || (EmojiEntity = {}));

//# sourceMappingURL=emoji.entity.js.map