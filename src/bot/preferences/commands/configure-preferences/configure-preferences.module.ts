import { forwardRef, Global, Module } from "@nestjs/common";
import { BuildPreferenceConfigure } from "./components/_build-preference-configure";
import { ConfigureRolesCommand } from "./configure-preferences.command";
import { GoBackButtonComponent } from "./components/go-back-button";
import { SalesPrivateLogModule } from "./components/sales-private-log/sales-private-log.module";
import { SalesPublicLogModule } from "./components/sales-public-log/sales-public-log.module";
import { FailLogModule } from "./components/fail-log/fail-log.module";

@Global()
@Module({
	imports: [SalesPrivateLogModule, SalesPublicLogModule, FailLogModule],
	controllers: [],
	providers: [ConfigureRolesCommand, GoBackButtonComponent, BuildPreferenceConfigure],
	exports: [ConfigureRolesCommand, GoBackButtonComponent, BuildPreferenceConfigure],
})
export class ConfigurePreferencesModule {}
