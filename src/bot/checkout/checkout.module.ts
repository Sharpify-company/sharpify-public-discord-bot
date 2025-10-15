import { Module } from '@nestjs/common';
import { ProductCardModule } from './components/product-card/product-card.module';
import { CheckoutCardModule } from './components/checkout-card/checkout-card.module';

@Module({
  imports: [ProductCardModule, CheckoutCardModule],
  controllers: [],
  providers: [],
})
export class CheckoutModule {}
