import { forwardRef, Global, Module } from "@nestjs/common";
import { BuildFailLogSection } from "./_build-fail-log-section";
import { SelectFailLogChannel } from "./select-fail-log-channel-section";
import { FailLogButtonComponent } from "./_fail-log.button";
import { EnableFailLogButton } from "./enable-fail-log-button";

@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [BuildFailLogSection, FailLogButtonComponent, SelectFailLogChannel, EnableFailLogButton],
	exports: [BuildFailLogSection, SelectFailLogChannel, FailLogButtonComponent, EnableFailLogButton],
})
export class FailLogModule {}
