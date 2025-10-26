import { Global, Module } from "@nestjs/common";
import { NecordModule } from "necord";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { dotEnv } from "./@shared/lib";
import { BotModule } from "./bot/bot.module";
import { WokerModule } from "./workers/worker.module";
import { ScheduleModule } from "@nestjs/schedule";
import { WsClientService } from "./app.ws.service";
import { WebsocketModule } from "./websocket/websocket.module";

@Global()
@Module({
	imports: [ScheduleModule.forRoot(), BotModule, WokerModule, WebsocketModule],
	controllers: [],
	providers: [WsClientService],
	exports: [WsClientService],
})
export class AppModule {}
