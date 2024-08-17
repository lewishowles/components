import PreviewSection from "@/preview/preview-section.vue";
import PreviewWrapper from "@/preview/preview-wrapper.vue";
import FormLayout from "@/components/form/form-layout/form-layout.vue";

import FormInputPreview from "@/components/form/form-input/form-input-preview.vue";
import FormPreview from "@/components/form/form-preview.vue";
import LinkTagPreview from "@/components/interaction/link-tag/link-tag-preview.vue";
import PillBadgePreview from "@/components/messaging/pill-badge/pill-badge-preview.vue";
import RadioGroupPreview from "@/components/form/radio-group/radio-group-preview.vue";
import UiButtonPreview from "@/components/interaction/ui-button/ui-button-preview.vue";

// Prepare previews for use with <component :is> to simplify preview management.
const previewLibrary = {
	install(app) {
		app.component("PreviewSection", PreviewSection);
		app.component("PreviewWrapper", PreviewWrapper);
		app.component("FormLayout", FormLayout);
		app.component("FormInputPreview", FormInputPreview);
		app.component("FormPreview", FormPreview);
		app.component("LinkTagPreview", LinkTagPreview);
		app.component("PillBadgePreview", PillBadgePreview);
		app.component("RadioGroupPreview", RadioGroupPreview);
		app.component("UiButtonPreview", UiButtonPreview);
	},
};

export default previewLibrary;
