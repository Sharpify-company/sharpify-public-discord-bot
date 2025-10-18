import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { TypeormProvider } from "./@shared/db/typeorm";

async function bootstrap() {
	await TypeormProvider.init();
	const app = await NestFactory.createApplicationContext(AppModule);

  

	// await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
