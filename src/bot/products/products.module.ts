import { Module } from '@nestjs/common';
import { ListProductsModule } from './commands';

@Module({
  imports: [ListProductsModule],
  controllers: [],
  providers: [],
})
export class ProductsModule {}
