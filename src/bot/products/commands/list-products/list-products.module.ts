import { Module } from '@nestjs/common';
import { ProductEmmbed } from './components/_product-emmbed';
import { ListProductsCommand } from './list-products.command';
import { SelectSetProductOnChannel } from './components/select-set-product-on-channel';
import { ProductCardComponent } from '@/bot/checkout/components';

@Module({
  imports: [],
  controllers: [],
  providers: [
    ListProductsCommand,
    ProductEmmbed,
    SelectSetProductOnChannel,
    ProductCardComponent,
  ],
})
export class ListProductsModule {}
