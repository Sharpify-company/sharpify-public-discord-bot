"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductEmmbed", {
    enumerable: true,
    get: function() {
        return ProductEmmbed;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
const _config = require("../../../../../config");
const _lib = require("../../../../../@shared/lib");
const _turndown = /*#__PURE__*/ _interop_require_default(require("turndown"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ProductEmmbed = class ProductEmmbed {
    createEmbbed(product) {
        return new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle(product.info.title).setFields({
            name: "Preço",
            value: `*${(0, _lib.formatPrice)(product.pricing.price)}*`,
            inline: true
        }, {
            name: "Estoque",
            value: `*${product.readonly.stockQuantityAvailable || "Ilimitado"}*`,
            inline: true
        }, {
            name: "ID",
            value: `*${product.id || "N/A"}*`,
            inline: true
        }).setDescription(product.info.discordDescription || new _turndown.default().turndown(product.info.description || "") || "Sem descrição").setImage(product.info.discordMainImage || product.info.mainImage || "");
    }
};
ProductEmmbed = _ts_decorate([
    (0, _common.Injectable)()
], ProductEmmbed);

//# sourceMappingURL=_product-emmbed.js.map