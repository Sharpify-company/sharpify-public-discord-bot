import { Module } from '@nestjs/common';
import { ListProductsModule } from './commands';
import { DeliveryProductsModule } from './commands/delivery-products/delivery-products.module';

@Module({
  imports: [ListProductsModule, DeliveryProductsModule],
  controllers: [],
  providers: [],
})
export class ProductsModule {}
