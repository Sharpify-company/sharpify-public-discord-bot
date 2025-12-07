import { Global, Module } from "@nestjs/common";
import { HandleOrderFeedbackSentUsecase } from "./_handle-order-feedback-sent.usecase";

@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [HandleOrderFeedbackSentUsecase],
	exports: [HandleOrderFeedbackSentUsecase],
})
export class HandleOrderFeedbackSentModule {}
