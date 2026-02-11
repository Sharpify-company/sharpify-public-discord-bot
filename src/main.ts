import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { TypeormProvider } from "./@shared/db/typeorm";
import { Sharpify } from "./@shared/sharpify";
import { StoreConfigEntity } from "./@shared/db/entities";
Error.stackTraceLimit = 50; // default is 10

// --- ANTI-CRASH ---
function formatStack(stack?: string) {
    if (!stack) return '   (sem stack trace)';
    const lines = stack.split('\n');
    const frames = lines.filter(l => l.trim().startsWith('at '));
    const srcFrames = frames.filter(l => l.includes('src\\') || l.includes('src/'))
        .filter(l => !l.includes('node_modules'));
    if (srcFrames.length > 0) {
        return `   📍 Seu código:\n${srcFrames.map(l => `   ${l.trim()}`).join('\n')}`;
    }
    const topFrames = frames.slice(0, 5);
    if (topFrames.length > 0) {
        return `   ⚠️ Nenhuma linha do seu código no stack (erro interno de lib).\n   Stack:\n${topFrames.map(l => `   ${l.trim()}`).join('\n')}`;
    }
    return '   (sem stack trace útil)';
}

process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 [Anti-Crash] Rejeição de Promise não tratada:');
    if (reason instanceof Error) {
        console.error(`   Nome: ${reason.name}`);
        console.error(`   Mensagem: ${reason.message}`);
        console.error(formatStack(reason.stack));
    } else {
        console.error('   Razão:', reason);
    }
});

process.on('uncaughtException', (error) => {
    console.error('🚨 [Anti-Crash] Erro não capturado:');
    console.error(`   Nome: ${error?.name}`);
    console.error(`   Mensagem: ${error?.message}`);
    console.error(formatStack(error?.stack));
});
// ------------------

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

	const app = await NestFactory.create(AppModule);

	await app.init();
}
bootstrap();
