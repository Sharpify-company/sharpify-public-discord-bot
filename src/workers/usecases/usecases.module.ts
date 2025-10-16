import { Global, Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandleProductEvent } from './handle-product-event';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [HandleProductEvent],
  exports: [HandleProductEvent],
})
export class UsecasesModule {}
