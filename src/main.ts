import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { TypeormProvider } from "./@shared/db/typeorm";
import { Sharpify } from "./@shared/sharpify";
import { StoreConfigEntity } from "./@shared/db/entities";

async function bootstrap() {
	await TypeormProvider.init();

	const getStoreReq = await Sharpify.api.v1.management.store.getStore();
	if (!getStoreReq.success) {
		throw new Error(
			`
			Buscar configuracao da loja falhou quando inicializando a aplicacão
			Verifique se a API_KEY e STORE_ID estão corretos, para mais detalhes veja o log abaixo.:
			` + getStoreReq.errorName,
		);
	}

	let storeConfigEntity = await StoreConfigEntity.findOneBy({ id: "DEFAULT" });
	if (!storeConfigEntity) await StoreConfigEntity.createStore(getStoreReq.data).save();
	else await storeConfigEntity.updateProps(getStoreReq.data);

	await NestFactory.createApplicationContext(AppModule);

	// await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
