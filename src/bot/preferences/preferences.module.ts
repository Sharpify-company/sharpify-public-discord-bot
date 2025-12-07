import { Module } from '@nestjs/common';
import { ConfigurePreferencesModule } from './commands/configure-preferences';


@Module({
  imports: [ConfigurePreferencesModule],
  controllers: [],
  providers: [],
})
export class PreferencesModule {}
