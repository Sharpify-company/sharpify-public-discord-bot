import { dotEnv } from "../lib";

import SharpifySdkImpl from "./api";

export const Sharpify = new SharpifySdkImpl({
	baseUrl: dotEnv.NODE_ENV === "development" ? "http://localhost:5000" : undefined,
	apiKey: dotEnv.API_TOKEN,
	storeId: dotEnv.STORE_ID,
});
