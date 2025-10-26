import { Module } from "@nestjs/common";
import { NecordModule } from "necord";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HandleExternalEventWs } from "./handle-external-event.ws";

@Module({
	imports: [],
	controllers: [],
	providers: [HandleExternalEventWs],
})
export class WebsocketModule {}
