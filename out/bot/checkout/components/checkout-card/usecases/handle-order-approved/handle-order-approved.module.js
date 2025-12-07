"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HandleOrderApprovedUsecaseModuleModule", {
    enumerable: true,
    get: function() {
        return HandleOrderApprovedUsecaseModuleModule;
    }
});
const _common = require("@nestjs/common");
const _handleorderapprovedusecase = require("./_handle-order-approved.usecase");
const _giveroletouserusecase = require("./give-role-to-user.usecase");
const _sendpublicsaleslogusecase = require("./send-public-sales-log.usecase");
const _sendprivatesaleslogusecase = require("./send-private-sales-log.usecase");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let HandleOrderApprovedUsecaseModuleModule = class HandleOrderApprovedUsecaseModuleModule {
};
HandleOrderApprovedUsecaseModuleModule = _ts_decorate([
    (0, _common.Global)(),
    (0, _common.Module)({
        imports: [],
        controllers: [],
        providers: [
            _handleorderapprovedusecase.HandleOrderApprovedUsecase,
            _giveroletouserusecase.GiveRoleToUserUsecase,
            _sendpublicsaleslogusecase.SendPublicSalesLogUsecase,
            _sendprivatesaleslogusecase.SendPrivateSalesLogUsecase
        ],
        exports: [
            _handleorderapprovedusecase.HandleOrderApprovedUsecase,
            _giveroletouserusecase.GiveRoleToUserUsecase,
            _sendpublicsaleslogusecase.SendPublicSalesLogUsecase,
            _sendprivatesaleslogusecase.SendPrivateSalesLogUsecase
        ]
    })
], HandleOrderApprovedUsecaseModuleModule);

//# sourceMappingURL=handle-order-approved.module.js.map