import { Global, Module } from "@nestjs/common";
import { NecordModule } from "necord";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HandleProductEvent } from "./handle-product-event";
import { HandleDeliverToDiscordUserPrivate } from "./handle-deliver-to-discord-user-private";
import { HandleCheckoutEvent } from "./handle-checkout-event";

@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [HandleProductEvent, HandleDeliverToDiscordUserPrivate, HandleCheckoutEvent],
	exports: [HandleProductEvent, HandleDeliverToDiscordUserPrivate, HandleCheckoutEvent],
})
export class UsecasesModule {}
