import { ExternalEventsEntity, OrderEntity, StoreConfigEntity } from "@/@shared/db/entities";
import { Sharpify } from "@/@shared/sharpify";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { HandleProductEvent } from "./usecases";

@Injectable()
export class RevalidateStoreConfigWorker {
	@Cron("0 * * * * *")
	handleCron() {
		this.execute();
	}

	async execute() {
		const getStoreReq = await Sharpify.api.v1.management.store.getStore();
		if (!getStoreReq.success) return console.error("Revalidar configuração da loja falhou:", getStoreReq.errorName);

		const storeConfigEntity = await StoreConfigEntity.findOneBy({ id: "DEFAULT" });
		if (!storeConfigEntity) await StoreConfigEntity.createStore(getStoreReq.data).save();
		else await storeConfigEntity.updateProps(getStoreReq.data);
	}
}
