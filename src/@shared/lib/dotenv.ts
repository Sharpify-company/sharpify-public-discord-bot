import * as dotenv from "dotenv";

dotenv.config({
	path: process.cwd() + "/.env",
});

import { z } from "zod";

const envSchema = z.object({
	DISCORD_TOKEN: z.string().min(1, "DISCORD_BOT_TOKEN is required"),
	DISCORD_GUILD_ID: z.string().min(1, "DISCORD_GUILD_ID is required"),
	STORE_ID: z.string().min(1, "STORE_ID is required"),
	CHECKOUT_CATEGORY_ID: z.string().min(1, "CHECKOUT_CATEGORY_ID is required"),
	API_TOKEN: z.string().min(1, "API_TOKEN is required"),
	DEFAULT_COLOR: z.string().optional(),

	NODE_ENV: z.enum(["development", "production", "test"]),
});

export const dotEnv = envSchema.parse(process.env);
