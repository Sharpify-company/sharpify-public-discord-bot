"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConfigureRolesModule", {
    enumerable: true,
    get: function() {
        return ConfigureRolesModule;
    }
});
const _common = require("@nestjs/common");
const _configurerolescommand = require("./configure-roles.command");
const _selectrole = require("./components/select-role");
const _buildroleconfigure = require("./components/_build-role-configure");
const _removeallrolesbutton = require("./components/remove-all-roles.button");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ConfigureRolesModule = class ConfigureRolesModule {
};
ConfigureRolesModule = _ts_decorate([
    (0, _common.Global)(),
    (0, _common.Module)({
        imports: [],
        controllers: [],
        providers: [
            _removeallrolesbutton.RemoveAllRolesComponent,
            _configurerolescommand.ConfigureRolesCommand,
            _buildroleconfigure.BuildRoleConfigure,
            _selectrole.SelectRole
        ],
        exports: [
            _removeallrolesbutton.RemoveAllRolesComponent
        ]
    })
], ConfigureRolesModule);

//# sourceMappingURL=configure-roles.module.js.map