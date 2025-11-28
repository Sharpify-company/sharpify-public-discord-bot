"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BuildRoleConfigure", {
    enumerable: true,
    get: function() {
        return BuildRoleConfigure;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
const _config = require("../../../../../config");
const _lib = require("../../../../../@shared/lib");
const _selectrole = require("./select-role");
const _sharpify = require("../../../../../@shared/sharpify");
const _removeallrolesbutton = require("./remove-all-roles.button");
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
let BuildRoleConfigure = class BuildRoleConfigure {
    async build() {
        const roles = await this.client.guilds.fetch(_lib.dotEnv.DISCORD_GUILD_ID).then((guild)=>guild.roles.fetch());
        const emmbed = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle("Configuração de Cargos por apos a compra").setDescription("Quando um membro realizar uma compra aqui pelo discord ou fazer uma compra estando logado pelo site usando o discord, ele receberá automaticamente os cargos configurados aqui!");
        const store = await (0, _sharpify.getLocalStoreConfig)();
        for (const role of roles.values()){
            const hasRoleInStore = store.applyRolesSettings?.some((r)=>r.roleId === role.id);
            if (!hasRoleInStore) continue;
            emmbed.addFields({
                name: role.name,
                value: `\`${role.id}\``
            });
        }
        const { RemoveAllRolesButton } = await this.removeAllRolesComponent.createButton();
        return {
            embeds: [
                emmbed
            ],
            components: [
                this.selectRole.createSelectChannel({}),
                {
                    type: 1,
                    components: [
                        RemoveAllRolesButton
                    ]
                }
            ],
            flags: [
                "Ephemeral"
            ]
        };
    }
    constructor(selectRole, removeAllRolesComponent, client){
        this.selectRole = selectRole;
        this.removeAllRolesComponent = removeAllRolesComponent;
        this.client = client;
    }
};
BuildRoleConfigure = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)((0, _common.forwardRef)(()=>_selectrole.SelectRole))),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_removeallrolesbutton.RemoveAllRolesComponent))),
    _ts_param(2, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _selectrole.SelectRole === "undefined" ? Object : _selectrole.SelectRole,
        typeof _removeallrolesbutton.RemoveAllRolesComponent === "undefined" ? Object : _removeallrolesbutton.RemoveAllRolesComponent,
        typeof _discord.Client === "undefined" ? Object : _discord.Client
    ])
], BuildRoleConfigure);

//# sourceMappingURL=_build-role-configure.js.map