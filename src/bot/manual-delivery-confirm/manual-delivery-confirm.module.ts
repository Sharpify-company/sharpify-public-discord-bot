
import { Module } from '@nestjs/common';
import { ConfirmDeliveryModule } from './commands/confirm-delivery/confirm-delivery.module';

@Module({
  imports: [ConfirmDeliveryModule],
  controllers: [],
  providers: [],
})
export class ManualDeliveryConfirmModule {}
