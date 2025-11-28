import { forwardRef, Global, Module } from "@nestjs/common";
import { ConfigureRolesCommand } from "./configure-roles.command";
import { SelectRole } from "./components/select-role";
import { BuildRoleConfigure } from "./components/_build-role-configure";
import { RemoveAllRolesComponent } from "./components/remove-all-roles.button";

@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [RemoveAllRolesComponent, ConfigureRolesCommand, BuildRoleConfigure, SelectRole],
	exports: [RemoveAllRolesComponent],
})
export class ConfigureRolesModule {}
