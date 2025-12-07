import { forwardRef, Global, Module } from "@nestjs/common";
import { BuildConfirmDeliveryLogSection } from "./_build-confirm-delivery-section";
import { SelectConfirmDeliveryLogChannel } from "./select-confirm-delivery-log-channel-section";
import { ConfirmDeliveryLogButtonComponent } from "./_confirm-delivery-log.button";
import { EnableConfirmDeliveryLogButton } from "./enable-confirm-delivery-log-button";

@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [
		BuildConfirmDeliveryLogSection,
		SelectConfirmDeliveryLogChannel,
		ConfirmDeliveryLogButtonComponent,
		EnableConfirmDeliveryLogButton,
	],
	exports: [
		BuildConfirmDeliveryLogSection,
		SelectConfirmDeliveryLogChannel,
		ConfirmDeliveryLogButtonComponent,
		EnableConfirmDeliveryLogButton,
	],
})
export class ConfirmDeliveryLogModule {}
