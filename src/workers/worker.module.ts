import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConsumeExternalEventWorker } from './consume-external-event.worker';
import { HandleExternalEventWorker } from './handle-external-event.worker';
import { UsecasesModule } from './usecases/usecases.module';
import { HandleOrderDeliveryWorker } from './handle-order-delivery.worker';

@Module({
  imports: [UsecasesModule],
  controllers: [],
  providers: [ConsumeExternalEventWorker, HandleExternalEventWorker, HandleOrderDeliveryWorker],
})
export class WokerModule {}
