import { StoreConfigEntity } from "../db/entities";
import { dotEnv } from "../lib";

import SharpifySdkImpl from "./api";

export const Sharpify = new SharpifySdkImpl({
	baseUrl: dotEnv.NODE_ENV === "development" ? "http://localhost:5000" : undefined,
	apiKey: dotEnv.API_TOKEN,
	storeId: dotEnv.STORE_ID,
});

export async function getLocalStoreConfig(): Promise<StoreConfigEntity> {
	const storeEntity = await StoreConfigEntity.findOne({ where: { id: "DEFAULT" } });
	if (!storeEntity) throw new Error("Store config not found in the local database.");
	return storeEntity;
}
