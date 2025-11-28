"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SelectRole", {
    enumerable: true,
    get: function() {
        return SelectRole;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _sharpify = require("../../../../../@shared/sharpify");
const _buildroleconfigure = require("./_build-role-configure");
const _types = require("../../../../../@shared/types");
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
let SelectRole = class SelectRole {
    async handleRolelSelected([interaction], selected) {
        const role = selected.first();
        if (!role) {
            return interaction.reply({
                content: "Nenhum cargo foi selecionado!",
                flags: [
                    "Ephemeral"
                ]
            });
        }
        if (role.permissions === "Administrator") {
            return interaction.reply({
                content: "Cargos com permissão de Administrador não podem ser selecionados!",
                flags: [
                    "Ephemeral"
                ]
            });
        }
        const store = await (0, _sharpify.getLocalStoreConfig)();
        const hasRole = (store.applyRolesSettings || []).some((r)=>r.roleId === role.id);
        if (hasRole) {
            return interaction.reply({
                content: "Cargo já está selecionado!",
                flags: [
                    "Ephemeral"
                ]
            });
        }
        await store.updateRoleSettings([
            ...store.applyRolesSettings || [],
            {
                roleId: role.id
            }
        ]);
        // interaction.message.edit(await this.buildRoleConfigure.build());
        interaction.update(await this.buildRoleConfigure.build());
    }
    createSelectChannel({}) {
        const selectMenu = new _discord.RoleSelectMenuBuilder().setCustomId(`select_role_on_purchase`).setPlaceholder("Selecione qual cargo colocar para o cliente...").setMaxValues(1).setMinValues(1);
        return new _discord.ActionRowBuilder().addComponents(selectMenu);
    }
    constructor(buildRoleConfigure){
        this.buildRoleConfigure = buildRoleConfigure;
    }
};
_ts_decorate([
    (0, _necord.RoleSelect)("select_role_on_purchase"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_param(1, (0, _necord.SelectedRoles)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _necord.RoleSelectContext === "undefined" ? Object : _necord.RoleSelectContext,
        typeof _necord.ISelectedRoles === "undefined" ? Object : _necord.ISelectedRoles
    ]),
    _ts_metadata("design:returntype", Promise)
], SelectRole.prototype, "handleRolelSelected", null);
SelectRole = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)((0, _common.forwardRef)(()=>_buildroleconfigure.BuildRoleConfigure))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType
    ])
], SelectRole);

//# sourceMappingURL=select-role.js.map