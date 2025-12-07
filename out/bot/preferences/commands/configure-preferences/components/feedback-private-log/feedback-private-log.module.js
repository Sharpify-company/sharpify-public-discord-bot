"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FeedbackPrivateLogModule", {
    enumerable: true,
    get: function() {
        return FeedbackPrivateLogModule;
    }
});
const _common = require("@nestjs/common");
const _buildfeedbackprivatelogsection = require("./_build-feedback-private-log-section");
const _selectpubliclogchannelsection = require("./select-public-log-channel-section");
const _feedbackprivatelogbutton = require("./_feedback-private-log.button");
const _enableprivatelogbutton = require("./enable-private-log-button");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FeedbackPrivateLogModule = class FeedbackPrivateLogModule {
};
FeedbackPrivateLogModule = _ts_decorate([
    (0, _common.Global)(),
    (0, _common.Module)({
        imports: [],
        controllers: [],
        providers: [
            _buildfeedbackprivatelogsection.BuildFeedbackPrivateLogSection,
            _selectpubliclogchannelsection.SelectFeedbackPrivateLogChannel,
            _feedbackprivatelogbutton.FeedbackPrivateLogButtonComponent,
            _enableprivatelogbutton.EnableFeedbackPrivateLogButton
        ],
        exports: [
            _buildfeedbackprivatelogsection.BuildFeedbackPrivateLogSection,
            _selectpubliclogchannelsection.SelectFeedbackPrivateLogChannel,
            _feedbackprivatelogbutton.FeedbackPrivateLogButtonComponent,
            _enableprivatelogbutton.EnableFeedbackPrivateLogButton
        ]
    })
], FeedbackPrivateLogModule);

//# sourceMappingURL=feedback-private-log.module.js.map