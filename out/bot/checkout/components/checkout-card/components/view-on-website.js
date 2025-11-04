"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ViewOnWebsiteButtonComponent", {
    enumerable: true,
    get: function() {
        return ViewOnWebsiteButtonComponent;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
const _sectionmanager = require("../section-manager");
const _types = require("../../../../../@shared/types");
const _sharpify = require("../../../../../@shared/sharpify");
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
let ViewOnWebsiteButtonComponent = class ViewOnWebsiteButtonComponent {
    async createButton({ orderId }) {
        const { url } = await (0, _sharpify.getLocalStoreConfig)();
        const ViewOnWebsiteButton = new _discord.ButtonBuilder().setLabel("Pagar no site") // text on the button
        .setStyle(_discord.ButtonStyle.Link) // gray button, like in the image
        .setEmoji("🔗").setURL(`${url}/checkout/${orderId}`);
        return {
            ViewOnWebsiteButton
        };
    }
    constructor(client, sectionManagerHandler){
        this.client = client;
        this.sectionManagerHandler = sectionManagerHandler;
    }
};
ViewOnWebsiteButtonComponent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_sectionmanager.SectionManagerHandler))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType
    ])
], ViewOnWebsiteButtonComponent);

//# sourceMappingURL=view-on-website.js.map