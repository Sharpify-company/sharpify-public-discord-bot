import { Module } from "@nestjs/common";
import { ListProductsCommand } from "./delivery-products.command";

@Module({
	imports: [],
	controllers: [],
	providers: [ListProductsCommand],
})
export class DeliveryProductsModule {}
