import { forwardRef, Global, Module } from "@nestjs/common";
import { BuildPreferenceConfigure } from "./components/_build-preference-configure";
import { ConfigureRolesCommand } from "./configure-preferences.command";
import { GoBackButtonComponent } from "./components/go-back-button";
import { SalesPrivateLogModule } from "./components/sales-private-log/sales-private-log.module";
import { SalesPublicLogModule } from "./components/sales-public-log/sales-public-log.module";
import { FailLogModule } from "./components/fail-log/fail-log.module";
import { ConfirmDeliveryLogModule } from "./components/confirm-delivery-log/confirm-delivery-log.module";
import { FeedbackPublicLogModule } from "./components/feedback-public-log/feedback-public-log.module";
import { FeedbackPrivateLogModule } from "./components/feedback-private-log/feedback-private-log.module";

@Global()
@Module({
	imports: [
		SalesPrivateLogModule,
		SalesPublicLogModule,
		FailLogModule,
		ConfirmDeliveryLogModule,
		FeedbackPublicLogModule,
		FeedbackPrivateLogModule,
	],
	controllers: [],
	providers: [ConfigureRolesCommand, GoBackButtonComponent, BuildPreferenceConfigure],
	exports: [ConfigureRolesCommand, GoBackButtonComponent, BuildPreferenceConfigure],
})
export class ConfigurePreferencesModule {}
