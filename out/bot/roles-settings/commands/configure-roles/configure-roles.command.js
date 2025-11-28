"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConfigureRolesCommand", {
    enumerable: true,
    get: function() {
        return ConfigureRolesCommand;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _buildroleconfigure = require("./components/_build-role-configure");
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
let ConfigureRolesCommand = class ConfigureRolesCommand {
    async onConfigureRoles([interaction]) {
        return interaction.reply(await this.buildRoleConfigure.build());
    }
    constructor(buildRoleConfigure){
        this.buildRoleConfigure = buildRoleConfigure;
    }
};
_ts_decorate([
    (0, _necord.SlashCommand)({
        name: "configurar-cargos",
        description: "Configure os cargos que os membros do servidor vão receber apos realizar uma compra!",
        defaultMemberPermissions: [
            "Administrator"
        ]
    }),
    _ts_param(0, (0, _necord.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _necord.SlashCommandContext === "undefined" ? Object : _necord.SlashCommandContext
    ]),
    _ts_metadata("design:returntype", Promise)
], ConfigureRolesCommand.prototype, "onConfigureRoles", null);
ConfigureRolesCommand = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)((0, _common.forwardRef)(()=>_buildroleconfigure.BuildRoleConfigure))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _buildroleconfigure.BuildRoleConfigure === "undefined" ? Object : _buildroleconfigure.BuildRoleConfigure
    ])
], ConfigureRolesCommand);

//# sourceMappingURL=configure-roles.command.js.map