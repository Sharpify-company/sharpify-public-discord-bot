import { Global, Module } from "@nestjs/common";
import { NecordModule } from "necord";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { dotEnv } from "./@shared/lib";
import { BotModule } from "./bot/bot.module";
import { WokerModule } from "./workers/worker.module";
import { ScheduleModule } from "@nestjs/schedule";
import { WsClientService } from "./app.ws.service";
import { WebsocketModule } from "./websocket/websocket.module";
import { LogChannel } from "./log-channel.service";

@Global()
@Module({
	imports: [ScheduleModule.forRoot(), BotModule, WokerModule, WebsocketModule],
	controllers: [],
	providers: [WsClientService, LogChannel],
	exports: [WsClientService, LogChannel],
})
export class AppModule {}
