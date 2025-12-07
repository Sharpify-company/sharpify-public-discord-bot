"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FailLogModule", {
    enumerable: true,
    get: function() {
        return FailLogModule;
    }
});
const _common = require("@nestjs/common");
const _buildfaillogsection = require("./_build-fail-log-section");
const _selectfaillogchannelsection = require("./select-fail-log-channel-section");
const _faillogbutton = require("./_fail-log.button");
const _enablefaillogbutton = require("./enable-fail-log-button");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FailLogModule = class FailLogModule {
};
FailLogModule = _ts_decorate([
    (0, _common.Global)(),
    (0, _common.Module)({
        imports: [],
        controllers: [],
        providers: [
            _buildfaillogsection.BuildFailLogSection,
            _faillogbutton.FailLogButtonComponent,
            _selectfaillogchannelsection.SelectFailLogChannel,
            _enablefaillogbutton.EnableFailLogButton
        ],
        exports: [
            _buildfaillogsection.BuildFailLogSection,
            _selectfaillogchannelsection.SelectFailLogChannel,
            _faillogbutton.FailLogButtonComponent,
            _enablefaillogbutton.EnableFailLogButton
        ]
    })
], FailLogModule);

//# sourceMappingURL=fail-log.module.js.map