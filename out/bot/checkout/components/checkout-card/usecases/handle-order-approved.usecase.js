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
const _sharpify = require("../../../../../@shared/sharpify");
const _discord = require("discord.js");
const _common = require("@nestjs/common");
const _entities = require("../../../../../@shared/db/entities");
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
    async giveRoleToUser({ discordUserId }) {
        const guild = await this.client.guilds.fetch(process.env.DISCORD_GUILD_ID).catch(()=>null);
        if (!guild) return;
        const member = await guild.members.fetch(discordUserId).catch(()=>null);
        if (!member) return;
        const store = await (0, _sharpify.getLocalStoreConfig)();
        const rolesToGive = store?.applyRolesSettings || [];
        for (const roleToGive of rolesToGive){
            const role = await guild.roles.fetch(roleToGive.roleId).catch(()=>null);
            if (!role) continue;
            const result = await member.roles.add(role).catch((err)=>{
                console.log(err);
                return null;
            });
        }
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
    }
    constructor(client){
        this.client = client;
    }
};
HandleOrderApprovedUsecase = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client
    ])
], HandleOrderApprovedUsecase);

//# sourceMappingURL=handle-order-approved.usecase.js.map