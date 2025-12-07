import { forwardRef, Global, Module } from "@nestjs/common";
import { BuildSalesPublicLogSection } from "./_build-sales-public-log-section";
import { SelectSalesPublicLogChannel } from "./select-public-log-channel-section";
import { SalesPublicLogButtonComponent } from "./_sales-public-log.button";
import { EnableSalesPublicLogButton } from "./enable-public-log-button";
import { OnlyDiscordSalesPublicLogButton } from "./only-discord-sales.button";

@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [
		BuildSalesPublicLogSection,
		SelectSalesPublicLogChannel,
		SalesPublicLogButtonComponent,
		EnableSalesPublicLogButton,
		OnlyDiscordSalesPublicLogButton,
	],
	exports: [
		BuildSalesPublicLogSection,
		SelectSalesPublicLogChannel,
		SalesPublicLogButtonComponent,
		EnableSalesPublicLogButton,
		OnlyDiscordSalesPublicLogButton,
	],
})
export class SalesPublicLogModule {}
