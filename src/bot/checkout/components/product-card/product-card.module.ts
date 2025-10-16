import { Global, Module } from '@nestjs/common';
import { ProductCardComponent } from './product-card';
import { AddToCartButtonComponent } from './components/add-to-cart-button';
import { AddToCartEvent } from './events';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [ProductCardComponent, AddToCartButtonComponent, AddToCartEvent],
  exports: [AddToCartButtonComponent, ProductCardComponent],
})
export class ProductCardModule {}
