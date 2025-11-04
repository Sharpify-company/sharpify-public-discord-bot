"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CheckoutCardComponent", {
    enumerable: true,
    get: function() {
        return CheckoutCardComponent;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
const _sectionmanager = require("./section-manager");
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
let CheckoutCardComponent = class CheckoutCardComponent {
    async sendCheckoutCardToChannel({ channel, discordUser }) {
        const result = await this.sectionManagerHandler.setSection({
            discordUserId: discordUser.id,
            section: "MAIN"
        });
        return channel.send(result);
    }
    async editCheckoutCardToChannel({ channel, discordUser, messageId }) {
        const result = await this.sectionManagerHandler.setSection({
            discordUserId: discordUser.id,
            section: "MAIN"
        });
        const message = await channel.messages.fetch(messageId).catch(()=>null);
        await message?.edit(result);
    }
    constructor(client, sectionManagerHandler){
        this.client = client;
        this.sectionManagerHandler = sectionManagerHandler;
    }
};
CheckoutCardComponent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _sectionmanager.SectionManagerHandler === "undefined" ? Object : _sectionmanager.SectionManagerHandler
    ])
], CheckoutCardComponent);

//# sourceMappingURL=checkout-card.js.map