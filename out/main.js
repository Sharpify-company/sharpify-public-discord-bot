"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appmodule = require("./app.module");
const _typeorm = require("./@shared/db/typeorm");
const _sharpify = require("./@shared/sharpify");
const _entities = require("./@shared/db/entities");
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
    await _core.NestFactory.createApplicationContext(_appmodule.AppModule);
// await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

//# sourceMappingURL=main.js.map