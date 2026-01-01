"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BuildPreferenceConfigure", {
    enumerable: true,
    get: function() {
        return BuildPreferenceConfigure;
    }
});
const _common = require("@nestjs/common");
const _discord = require("discord.js");
const _config = require("../../../../../config");
const _salesprivatelogbutton = require("./sales-private-log/_sales-private-log.button");
const _types = require("../../../../../@shared/types");
const _buildsalesprivatelogsection = require("./sales-private-log/_build-sales-private-log-section");
const _salespubliclogbutton = require("./sales-public-log/_sales-public-log.button");
const _buildsalespubliclogsection = require("./sales-public-log/_build-sales-public-log-section");
const _faillogbutton = require("./fail-log/_fail-log.button");
const _buildfaillogsection = require("./fail-log/_build-fail-log-section");
const _confirmdeliverylogbutton = require("./confirm-delivery-log/_confirm-delivery-log.button");
const _buildconfirmdeliverysection = require("./confirm-delivery-log/_build-confirm-delivery-section");
const _buildfeedbackpubliclogsection = require("./feedback-public-log/_build-feedback-public-log-section");
const _feedbackpubliclogbutton = require("./feedback-public-log/_feedback-public-log.button");
const _feedbackprivatelogbutton = require("./feedback-private-log/_feedback-private-log.button");
const _buildfeedbackprivatelogsection = require("./feedback-private-log/_build-feedback-private-log-section");
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
let BuildPreferenceConfigure = class BuildPreferenceConfigure {
    async build({ section }) {
        if (section === "SALES_PRIVATE_LOG") {
            return this.buildSalesPrivateLogSection.build();
        }
        if (section === "SALES_PUBLIC_LOG") {
            return this.buildSalesPublicLogSection.build();
        }
        if (section === "FAIL_LOG") {
            return this.buildFailLogSection.build();
        }
        if (section === "CONFIRM_DELIVERY_LOG") {
            return this.buildConfirmDeliveryLogSection.build();
        }
        if (section === "FEEDBACK_PUBLIC_LOG") {
            return this.buildFeedbackPublicLogSection.build();
        }
        if (section === "FEEDBACK_PRIVATE_LOG") {
            return this.buildFeedbackPrivateLogSection.build();
        }
        const emmbed = new _discord.EmbedBuilder().setColor(_config.BotConfig.color).setTitle("Configuração de Preferências").setDescription("Aqui você pode configurar as preferencias do bot como logs, eventos etc.");
        const { salesPrivateLogButton } = await this.salesPrivateLogButtonComponent.createButton();
        const { salesPublicLogButton } = await this.salesPublicLogButtonComponent.createButton();
        const { failLogButton } = await this.failLogButtonComponent.createButton();
        const { confirmDeliveryLogButton } = await this.confirmDeliveryLogButtonComponent.createButton();
        const { feedbackPublicLogButton } = await this.feedbackPublicLogButtonComponent.createButton();
        const { feedbackPrivateLogButton } = await this.feedbackPrivateLogButtonComponent.createButton();
        return {
            embeds: [
                emmbed
            ],
            components: [
                {
                    type: 1,
                    components: [
                        new _discord.ButtonBuilder().setCustomId("title_logs").setLabel("📦 Logs de Vendas").setStyle(_discord.ButtonStyle.Primary).setDisabled(true),
                        salesPrivateLogButton,
                        salesPublicLogButton
                    ]
                },
                {
                    type: 1,
                    components: [
                        new _discord.ButtonBuilder().setCustomId("title_feedback").setLabel("⭐ Feedback").setStyle(_discord.ButtonStyle.Primary).setDisabled(true),
                        feedbackPrivateLogButton,
                        feedbackPublicLogButton
                    ]
                },
                {
                    type: 1,
                    components: [
                        new _discord.ButtonBuilder().setCustomId("title_entrega").setLabel("🚚 Entrega e falhas").setStyle(_discord.ButtonStyle.Primary).setDisabled(true),
                        confirmDeliveryLogButton,
                        failLogButton
                    ]
                }
            ],
            flags: [
                "Ephemeral"
            ]
        };
    }
    constructor(salesPrivateLogButtonComponent, salesPublicLogButtonComponent, failLogButtonComponent, confirmDeliveryLogButtonComponent, feedbackPublicLogButtonComponent, feedbackPrivateLogButtonComponent, buildSalesPrivateLogSection, buildSalesPublicLogSection, buildFailLogSection, buildConfirmDeliveryLogSection, buildFeedbackPublicLogSection, buildFeedbackPrivateLogSection, client){
        this.salesPrivateLogButtonComponent = salesPrivateLogButtonComponent;
        this.salesPublicLogButtonComponent = salesPublicLogButtonComponent;
        this.failLogButtonComponent = failLogButtonComponent;
        this.confirmDeliveryLogButtonComponent = confirmDeliveryLogButtonComponent;
        this.feedbackPublicLogButtonComponent = feedbackPublicLogButtonComponent;
        this.feedbackPrivateLogButtonComponent = feedbackPrivateLogButtonComponent;
        this.buildSalesPrivateLogSection = buildSalesPrivateLogSection;
        this.buildSalesPublicLogSection = buildSalesPublicLogSection;
        this.buildFailLogSection = buildFailLogSection;
        this.buildConfirmDeliveryLogSection = buildConfirmDeliveryLogSection;
        this.buildFeedbackPublicLogSection = buildFeedbackPublicLogSection;
        this.buildFeedbackPrivateLogSection = buildFeedbackPrivateLogSection;
        this.client = client;
    }
};
BuildPreferenceConfigure = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)((0, _common.forwardRef)(()=>_salesprivatelogbutton.SalesPrivateLogButtonComponent))),
    _ts_param(1, (0, _common.Inject)((0, _common.forwardRef)(()=>_salespubliclogbutton.SalesPublicLogButtonComponent))),
    _ts_param(2, (0, _common.Inject)((0, _common.forwardRef)(()=>_faillogbutton.FailLogButtonComponent))),
    _ts_param(3, (0, _common.Inject)((0, _common.forwardRef)(()=>_confirmdeliverylogbutton.ConfirmDeliveryLogButtonComponent))),
    _ts_param(4, (0, _common.Inject)((0, _common.forwardRef)(()=>_feedbackpubliclogbutton.FeedbackPublicLogButtonComponent))),
    _ts_param(5, (0, _common.Inject)((0, _common.forwardRef)(()=>_feedbackprivatelogbutton.FeedbackPrivateLogButtonComponent))),
    _ts_param(6, (0, _common.Inject)((0, _common.forwardRef)(()=>_buildsalesprivatelogsection.BuildSalesPrivateLogSection))),
    _ts_param(7, (0, _common.Inject)((0, _common.forwardRef)(()=>_buildsalespubliclogsection.BuildSalesPublicLogSection))),
    _ts_param(8, (0, _common.Inject)((0, _common.forwardRef)(()=>_buildfaillogsection.BuildFailLogSection))),
    _ts_param(9, (0, _common.Inject)((0, _common.forwardRef)(()=>_buildconfirmdeliverysection.BuildConfirmDeliveryLogSection))),
    _ts_param(10, (0, _common.Inject)((0, _common.forwardRef)(()=>_buildfeedbackpubliclogsection.BuildFeedbackPublicLogSection))),
    _ts_param(11, (0, _common.Inject)((0, _common.forwardRef)(()=>_buildfeedbackprivatelogsection.BuildFeedbackPrivateLogSection))),
    _ts_param(12, (0, _common.Inject)(_discord.Client)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _salesprivatelogbutton.SalesPrivateLogButtonComponent === "undefined" ? Object : _salesprivatelogbutton.SalesPrivateLogButtonComponent,
        typeof _salespubliclogbutton.SalesPublicLogButtonComponent === "undefined" ? Object : _salespubliclogbutton.SalesPublicLogButtonComponent,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType,
        typeof _types.WrapperType === "undefined" ? Object : _types.WrapperType,
        typeof _discord.Client === "undefined" ? Object : _discord.Client
    ])
], BuildPreferenceConfigure);

//# sourceMappingURL=_build-preference-configure.js.map