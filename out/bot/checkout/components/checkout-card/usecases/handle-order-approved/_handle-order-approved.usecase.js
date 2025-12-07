"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HandleOrderApprovedUsecase", {
    enumerable: true,
    get: function() {
        return HandleOrderApprovedUsecase;
    }
});
const _discord = require("discord.js");
const _common = require("@nestjs/common");
const _entities = require("../../../../../../@shared/db/entities");
const _giveroletouserusecase = require("./give-role-to-user.usecase");
const _sendpublicsaleslogusecase = require("./send-public-sales-log.usecase");
const _sendprivatesaleslogusecase = require("./send-private-sales-log.usecase");
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
let HandleOrderApprovedUsecase = class HandleOrderApprovedUsecase {
    async giveRoleToUser(input) {
        return this.giveRoleToUserUsecase.execute(input);
    }
    async sendPublicSalesLog(input) {
        return this.sendPublicSalesLogUsecase.execute(input);
    }
    async sendPrivateSalesLog(input) {
        return this.sendPrivateSalesLogUsecase.execute(input);
    }
    async execute({ orderId }) {
        const orderEntity = await _entities.OrderEntity.findOneBy({
            id: orderId
        });
        if (!orderEntity) return;
        const discordUser = await _entities.DiscordUserEntity.findOneBy({
            id: orderEntity.customerId
        });
        if (!discordUser) return;
        const orderChannel = await this.client.channels.fetch(discordUser.cart.channelId).catch(()=>null);
        orderChannel && await orderChannel.delete().catch(()=>null);
        await orderEntity.markAsPreparingDelivery();
        await discordUser.cart.cancelOrder();
        await this.giveRoleToUser({
            discordUserId: discordUser.id
        });
        await this.sendPublicSalesLog({
            discordUserId: discordUser.id,
            orderProps: orderEntity.orderProps
        });
        await this.sendPrivateSalesLog({
            discordUserId: discordUser.id,
            orderProps: orderEntity.orderProps
        });
    }
    constructor(client, giveRoleToUserUsecase, sendPublicSalesLogUsecase, sendPrivateSalesLogUsecase){
        this.client = client;
        this.giveRoleToUserUsecase = giveRoleToUserUsecase;
        this.sendPublicSalesLogUsecase = sendPublicSalesLogUsecase;
        this.sendPrivateSalesLogUsecase = sendPrivateSalesLogUsecase;
    }
};
HandleOrderApprovedUsecase = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _giveroletouserusecase.GiveRoleToUserUsecase === "undefined" ? Object : _giveroletouserusecase.GiveRoleToUserUsecase,
        typeof _sendpublicsaleslogusecase.SendPublicSalesLogUsecase === "undefined" ? Object : _sendpublicsaleslogusecase.SendPublicSalesLogUsecase,
        typeof _sendprivatesaleslogusecase.SendPrivateSalesLogUsecase === "undefined" ? Object : _sendprivatesaleslogusecase.SendPrivateSalesLogUsecase
    ])
], HandleOrderApprovedUsecase);

//# sourceMappingURL=_handle-order-approved.usecase.js.map