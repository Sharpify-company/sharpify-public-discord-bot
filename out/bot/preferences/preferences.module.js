"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PreferencesModule", {
    enumerable: true,
    get: function() {
        return PreferencesModule;
    }
});
const _common = require("@nestjs/common");
const _configurepreferences = require("./commands/configure-preferences");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let PreferencesModule = class PreferencesModule {
};
PreferencesModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _configurepreferences.ConfigurePreferencesModule
        ],
        controllers: [],
        providers: []
    })
], PreferencesModule);

//# sourceMappingURL=preferences.module.js.map