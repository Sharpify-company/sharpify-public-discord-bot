import { Module } from "@nestjs/common";
import { NecordModule, IntegerOption } from "necord";
import { dotEnv } from "../@shared/lib";
import { AppUpdate } from "./bot.update";
import { AppService } from "./bot.service";
import { ProductsModule } from "./products/products.module";
import { CheckoutModule } from "./checkout/checkout.module";
import { EmojiService } from "./emoji.service";
import { RoleSettingsModule } from "./roles-settings/roles-settings.module";
import { PreferencesModule } from "./preferences/preferences.module";

@Module({
	imports: [
		NecordModule.forRoot({
			token: dotEnv.DISCORD_TOKEN,
			development: [dotEnv.DISCORD_GUILD_ID],
			intents: [
				"Guilds",
				"GuildMessages",
				"Guilds",
				"GuildMembers",
				"GuildMessages",
				"GuildMessageReactions",
				"GuildPresences",
				"MessageContent",
			],
		}),
		ProductsModule,
		CheckoutModule,
		RoleSettingsModule,
		PreferencesModule
	],
	controllers: [],
	providers: [AppUpdate, AppService, EmojiService],
})
export class BotModule {}
