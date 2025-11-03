import { ColorResolvable } from "discord.js";
import { dotEnv } from "./@shared/lib";

export const BotConfig = {
	color: (dotEnv.DEFAULT_COLOR as any) || "#0099ff",
} as const satisfies { color: ColorResolvable };
