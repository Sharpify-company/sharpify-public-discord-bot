import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { TypeormProvider } from "./@shared/db/typeorm";
import { Sharpify } from "./@shared/sharpify";
import { StoreConfigEntity } from "./@shared/db/entities";

// --- ADICIONE ISSO AQUI PARA EVITAR CRASH ---
process.on("unhandledRejection", (reason, promise) => {
	console.error("🚨 [Anti-Crash] Rejeição de Promise não tratada:");
	console.error("Razão:", reason);
	if (reason instanceof Error) {
		console.error("Stack trace:", reason.stack);
	}
	// O simples fato de ouvir esse evento impede o Node de fechar o processo
});

process.on("uncaughtException", (error) => {
	console.error("🚨 [Anti-Crash] Erro não capturado:", error?.name);
	console.error("Mensagem:", error?.message);
	console.error("Stack trace:", error?.stack);
	// Impede o fechamento abrupto
});
// -------------------------------------------

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

	const storeConfigEntity = await StoreConfigEntity.findOneBy({ id: "DEFAULT" });
	if (!storeConfigEntity) await StoreConfigEntity.createStore(getStoreReq.data).save();
	else await storeConfigEntity.updateProps(getStoreReq.data);

	const app = await NestFactory.create(AppModule);

	await app.init();
}
bootstrap();
