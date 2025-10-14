import { Module } from '@nestjs/common';
import { NecordModule, IntegerOption } from 'necord';
import { dotEnv } from '../@shared/lib';
import { AppUpdate } from './bot.update';
import { AppService } from './bot.service';
import { ProductsModule } from './products/products.module';


@Module({
  imports: [
    NecordModule.forRoot({
      token: dotEnv.DISCORD_TOKEN,
      development: [dotEnv.DISCORD_GUILD_ID],
      intents: ['Guilds', 'GuildMessages'],
    }),
    ProductsModule
  ],
  controllers: [],
  providers: [AppUpdate, AppService],
})
export class BotModule {}
