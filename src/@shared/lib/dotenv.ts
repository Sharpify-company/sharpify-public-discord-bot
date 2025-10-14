import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({
    path: process.cwd() + '/.env',
  });
}

import { z } from 'zod';

const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1, 'DISCORD_BOT_TOKEN is required'),
  DISCORD_GUILD_ID: z.string().min(1, 'DISCORD_GUILD_ID is required'),
  STORE_ID: z.string().min(1, 'STORE_ID is required'),
  CHECKOUT_CATEGORY_ID: z.string().min(1, 'CHECKOUT_CATEGORY_ID is required'),

  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const dotEnv = envSchema.parse(process.env);
