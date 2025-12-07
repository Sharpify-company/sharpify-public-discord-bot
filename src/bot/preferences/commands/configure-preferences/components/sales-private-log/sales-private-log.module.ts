import { forwardRef, Global, Module } from "@nestjs/common";
import { BuildSalesPrivateLogSection } from "./_build-sales-private-log-section";
import { SelectSalesPrivateLogChannel } from "./select-private-log-channel-section";
import { SalesPrivateLogButtonComponent } from "./_sales-private-log.button";
import { EnableSalesPrivateLogButton } from "./enable-private-log-button";
import { OnlyDiscordSalesPrivateLogButton } from "./only-discord-sales.button";

@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [
		BuildSalesPrivateLogSection,
		SelectSalesPrivateLogChannel,
		SalesPrivateLogButtonComponent,
		EnableSalesPrivateLogButton,
		OnlyDiscordSalesPrivateLogButton,
	],
	exports: [
		BuildSalesPrivateLogSection,
		SelectSalesPrivateLogChannel,
		SalesPrivateLogButtonComponent,
		EnableSalesPrivateLogButton,
		OnlyDiscordSalesPrivateLogButton,
	],
})
export class SalesPrivateLogModule {}
