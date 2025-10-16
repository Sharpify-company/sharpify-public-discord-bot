import { Module } from "@nestjs/common";
import { NecordModule } from "necord";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { dotEnv } from "./@shared/lib";
import { BotModule } from "./bot/bot.module";
import { WokerModule } from "./workers/worker.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
	imports: [ScheduleModule.forRoot(), BotModule, WokerModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
