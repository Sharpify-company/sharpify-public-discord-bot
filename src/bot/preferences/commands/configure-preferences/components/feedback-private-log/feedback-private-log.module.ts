import { forwardRef, Global, Module } from "@nestjs/common";
import { BuildFeedbackPrivateLogSection } from "./_build-feedback-private-log-section";
import { SelectFeedbackPrivateLogChannel } from "./select-public-log-channel-section";
import { FeedbackPrivateLogButtonComponent } from "./_feedback-private-log.button";
import { EnableFeedbackPrivateLogButton } from "./enable-private-log-button";

@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [
		BuildFeedbackPrivateLogSection,
		SelectFeedbackPrivateLogChannel,
		FeedbackPrivateLogButtonComponent,
		EnableFeedbackPrivateLogButton,
	],
	exports: [
		BuildFeedbackPrivateLogSection,
		SelectFeedbackPrivateLogChannel,
		FeedbackPrivateLogButtonComponent,
		EnableFeedbackPrivateLogButton,
	],
})
export class FeedbackPrivateLogModule {}
