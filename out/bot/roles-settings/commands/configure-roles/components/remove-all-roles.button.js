"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RemoveAllRolesComponent", {
    enumerable: true,
    get: function() {
        return RemoveAllRolesComponent;
    }
});
const _common = require("@nestjs/common");
const _necord = require("necord");
const _discord = require("discord.js");
const _types = require("../../../../../@shared/types");
const _sharpify = require("../../../../../@shared/sharpify");
const _buildroleconfigure = require("./_build-role-configure");
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
let RemoveAllRolesComponent = class RemoveAllRolesComponent {
    async handleButtonClicked([interaction]) {
        const store = await (0, _sharpify.getLocalStoreConfig)();
        await store.updateRoleSettings([]);
        await interaction.update(await this.buildRoleConfigure.build());
    // interaction.reply({
    // 	content: "Todos os cargos foram removidos com successo!",
    // 	flags: ["Ephemeral"],
    // });
    }
    async createButton() {
        const RemoveAllRolesButton = new _discord.ButtonBuilder().setCustomId(`remove_all_roles`) // unique ID to handle clicks
        .setLabel("Remover todos os cargos") // text on the button
        .setStyle(_discord.ButtonStyle.Danger); // gray button, like in the image
        return {
            RemoveAllRolesButton
        };
    }
    constructor(client, buildRoleConfigure){
        this.client = client;
        this.buildRoleConfigure = buildRoleConfigure;
    }
};
_ts_decorate([
    (0, _necord.Button)("remove_all_roles"),
    _ts_param(0, (0, _necord.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], RemoveAllRolesComponent.prototype, "handleButtonClicked", null);
RemoveAllRolesComponent = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_discord.Client)),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_buildroleconfigure.BuildRoleConfigure))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _discord.Client === "undefined" ? Object : _discord.Client,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType
    ])
], RemoveAllRolesComponent);

//# sourceMappingURL=remove-all-roles.button.js.map