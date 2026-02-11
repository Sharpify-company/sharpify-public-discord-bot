import { Global, Module } from "@nestjs/common";
import { HandleOrderApprovedUsecase } from "./_handle-order-approved.usecase";
import { GiveRoleToUserUsecase } from "./give-role-to-user.usecase";
import { SendPublicSalesLogUsecase } from "./send-public-sales-log.usecase";
import { SendPrivateSalesLogUsecase } from "./send-private-sales-log.usecase";

@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [HandleOrderApprovedUsecase, GiveRoleToUserUsecase, SendPublicSalesLogUsecase, SendPrivateSalesLogUsecase],
	exports: [HandleOrderApprovedUsecase, GiveRoleToUserUsecase, SendPublicSalesLogUsecase, SendPrivateSalesLogUsecase],
})
export class HandleOrderApprovedUsecaseModuleModule {}
