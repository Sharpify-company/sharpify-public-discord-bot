import { Module } from "@nestjs/common";
import { ProductEmmbed } from "./components/_product-emmbed";
import { ListProductsCommand } from "./list-products.command";
import { SelectSetProductOnChannel } from "./components/select-set-product-on-channel";
import { ProductCardComponent } from "@/bot/checkout/components";
import { CreateConfigButtonComponent } from "./components/create-config-button";

@Module({
	imports: [],
	controllers: [],
	providers: [ListProductsCommand, ProductEmmbed, SelectSetProductOnChannel, ProductCardComponent, CreateConfigButtonComponent],
})
export class ListProductsModule {}
