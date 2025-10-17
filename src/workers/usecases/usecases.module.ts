import { Global, Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandleProductEvent } from './handle-product-event';
import { HandleDeliverToDiscordUserPrivate } from './handle-deliver-to-discord-user-private';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [HandleProductEvent, HandleDeliverToDiscordUserPrivate],
  exports: [HandleProductEvent, HandleDeliverToDiscordUserPrivate],
})
export class UsecasesModule {}
