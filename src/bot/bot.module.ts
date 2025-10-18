import { Module } from '@nestjs/common';
import { NecordModule, IntegerOption } from 'necord';
import { dotEnv } from '../@shared/lib';
import { AppUpdate } from './bot.update';
import { AppService } from './bot.service';
import { ProductsModule } from './products/products.module';
import { CheckoutModule } from './checkout/checkout.module';
import { EmojiService } from './emoji.service';


@Module({
  imports: [
    NecordModule.forRoot({
      token: dotEnv.DISCORD_TOKEN,
      development: [dotEnv.DISCORD_GUILD_ID],
      intents: ['Guilds', 'GuildMessages'],
    }),
    ProductsModule,
    CheckoutModule
  ],
  controllers: [],
  providers: [AppUpdate, AppService, EmojiService],
})
export class BotModule {}
