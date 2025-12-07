"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FeedbackPublicLogModule", {
    enumerable: true,
    get: function() {
        return FeedbackPublicLogModule;
    }
});
const _common = require("@nestjs/common");
const _buildfeedbackpubliclogsection = require("./_build-feedback-public-log-section");
const _selectpubliclogchannelsection = require("./select-public-log-channel-section");
const _feedbackpubliclogbutton = require("./_feedback-public-log.button");
const _enablepubliclogbutton = require("./enable-public-log-button");
const _onlydiscordsalesbutton = require("./only-discord-sales.button");
const _minfeedbackstar = require("./min-feedback-star");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FeedbackPublicLogModule = class FeedbackPublicLogModule {
};
FeedbackPublicLogModule = _ts_decorate([
    (0, _common.Global)(),
    (0, _common.Module)({
        imports: [],
        controllers: [],
        providers: [
            _buildfeedbackpubliclogsection.BuildFeedbackPublicLogSection,
            _selectpubliclogchannelsection.SelectFeedbackPublicLogChannel,
            _feedbackpubliclogbutton.FeedbackPublicLogButtonComponent,
            _enablepubliclogbutton.EnableFeedbackPublicLogButton,
            _onlydiscordsalesbutton.OnlyDiscordFeebackSalesPublicLogButton,
            _minfeedbackstar.MinFeedbackStarButton
        ],
        exports: [
            _buildfeedbackpubliclogsection.BuildFeedbackPublicLogSection,
            _selectpubliclogchannelsection.SelectFeedbackPublicLogChannel,
            _feedbackpubliclogbutton.FeedbackPublicLogButtonComponent,
            _enablepubliclogbutton.EnableFeedbackPublicLogButton,
            _onlydiscordsalesbutton.OnlyDiscordFeebackSalesPublicLogButton,
            _minfeedbackstar.MinFeedbackStarButton
        ]
    })
], FeedbackPublicLogModule);

//# sourceMappingURL=feedback-public-log.module.js.map