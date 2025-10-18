import { dotEnv } from "@/@shared/lib";
import { Injectable, Logger } from "@nestjs/common";
import { Once, Context, ContextOf } from "necord";
import path from "path";
import * as fs from "fs";
import { EmojiEntity } from "@/@shared/db/entities";

@Injectable()
export class EmojiService {
	@Once("clientReady")
	public async onReady(@Context() [client]: ContextOf<"ready">) {
		const application = await client.application.fetch().catch(() => null);
		if (!application) return console.log("Guild não encontrado.");

		const emojiDir = path.join(process.cwd(), "assets", "emojis");
		if (!fs.existsSync(emojiDir)) {
			console.error("❌ Pasta de emojis não encontrada:", emojiDir);
			return;
		}

		const files = fs.readdirSync(emojiDir).filter((file) => /\.(png|jpg|jpeg|gif)$/i.test(file));

		for (const file of files) {
			const emojiName = `Sharpify_${path.parse(file).name}`;

			const exists = application.emojis.cache.find((e) => e.name === emojiName);
			if (exists) continue;

			const existsOnDb = await EmojiEntity.findOneBy({ name: emojiName as any });
			if (existsOnDb) continue;

			const filePath = path.join(emojiDir, file);
			try {
				const emoji = await application.emojis.create({
					name: emojiName,
					attachment: filePath,
				});

				await EmojiEntity.createEmoji({
					id: emoji.id,
					name: emoji.name,
				}).save();

				console.log(`✅ Emoji criado: ${emoji.name}`);
			} catch (err) {
				if ((err as any).code === 50035) {
					console.log(`⚙️ Emoji '${emojiName}' já existe (erro capturado), pulando.`);
				} else console.error(`❌ Erro ao criar emoji '${emojiName}':`, JSON.stringify(err));
			}
		}
	}
}
