import { Module } from '@nestjs/common';
import { ProductCardModule } from './components/product-card/product-card.module';

@Module({
  imports: [ProductCardModule],
  controllers: [],
  providers: [],
})
export class CheckoutModule {}
