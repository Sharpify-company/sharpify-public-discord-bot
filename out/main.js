"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appmodule = require("./app.module");
const _typeorm = require("./@shared/db/typeorm");
const _sharpify = require("./@shared/sharpify");
const _entities = require("./@shared/db/entities");
// --- ADICIONE ISSO AQUI PARA EVITAR CRASH ---
process.on('unhandledRejection', (reason, promise)=>{
    console.error('🚨 [Anti-Crash] Rejeição de Promise não tratada:', reason);
// O simples fato de ouvir esse evento impede o Node de fechar o processo
});
process.on('uncaughtException', (error)=>{
    console.error('🚨 [Anti-Crash] Erro não capturado:', error?.name);
// Impede o fechamento abrupto
});
// -------------------------------------------
async function bootstrap() {
    await _typeorm.TypeormProvider.init();
    const getStoreReq = await _sharpify.Sharpify.api.v1.management.store.getStore();
    if (!getStoreReq.success) {
        throw new Error(`
			Buscar configuracao da loja falhou quando inicializando a aplicacão
			Verifique se a API_KEY e STORE_ID estão corretos, para mais detalhes veja o log abaixo.:
			` + getStoreReq.errorName);
    }
    let storeConfigEntity = await _entities.StoreConfigEntity.findOneBy({
        id: "DEFAULT"
    });
    if (!storeConfigEntity) await _entities.StoreConfigEntity.createStore(getStoreReq.data).save();
    else await storeConfigEntity.updateProps(getStoreReq.data);
    const app = await _core.NestFactory.create(_appmodule.AppModule);
    await app.init();
}
bootstrap();

//# sourceMappingURL=main.js.map