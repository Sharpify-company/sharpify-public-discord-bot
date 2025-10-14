import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dotEnv } from './@shared/lib';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [BotModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
