import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConsumeExternalEventWorker } from './consume-external-event.worker';
import { HandleExternalEventWorker } from './handle-external-event.worker';
import { UsecasesModule } from './usecases/usecases.module';
import { HandleOrderDeliveryWorker } from './handle-order-delivery.worker';
import { ExpireOrderWorker } from './expire-order.worker';

@Module({
  imports: [UsecasesModule],
  controllers: [],
  providers: [ConsumeExternalEventWorker, HandleExternalEventWorker, HandleOrderDeliveryWorker, ExpireOrderWorker],
})
export class WokerModule {}
