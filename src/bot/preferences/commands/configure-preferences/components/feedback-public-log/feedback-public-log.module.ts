import { forwardRef, Global, Module } from "@nestjs/common";
import { BuildFeedbackPublicLogSection } from "./_build-feedback-public-log-section";
import { SelectFeedbackPublicLogChannel } from "./select-public-log-channel-section";
import { FeedbackPublicLogButtonComponent } from "./_feedback-public-log.button";
import { EnableFeedbackPublicLogButton } from "./enable-public-log-button";
import { OnlyDiscordFeebackSalesPublicLogButton } from "./only-discord-sales.button";
import { MinFeedbackStarButton } from "./min-feedback-star";

@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [
		BuildFeedbackPublicLogSection,
		SelectFeedbackPublicLogChannel,
		FeedbackPublicLogButtonComponent,
		EnableFeedbackPublicLogButton,
		OnlyDiscordFeebackSalesPublicLogButton,
		MinFeedbackStarButton,
	],
	exports: [
		BuildFeedbackPublicLogSection,
		SelectFeedbackPublicLogChannel,
		FeedbackPublicLogButtonComponent,
		EnableFeedbackPublicLogButton,
		OnlyDiscordFeebackSalesPublicLogButton,
		MinFeedbackStarButton,
	],
})
export class FeedbackPublicLogModule {}
