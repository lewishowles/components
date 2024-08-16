import FormPreview from "@/components/form/form-preview.vue";
import FormInputPreview from "@/components/form/form-input/form-input-preview.vue";
import LinkTagPreview from "@/components/interaction/link-tag/link-tag-preview.vue";
import RadioGroupPreview from "@/components/form/radio-group/radio-group-preview.vue";
import UiButtonPreview from "@/components/interaction/ui-button/ui-button-preview.vue";

// Prepare previews for use with <component :is> to simplify preview management.
const previewLibrary = {
	install(app) {
		app.component("FormPreview", FormPreview);
		app.component("FormInputPreview", FormInputPreview);
		app.component("LinkTagPreview", LinkTagPreview);
		app.component("RadioGroupPreview", RadioGroupPreview);
		app.component("UiButtonPreview", UiButtonPreview);
	},
};

export default previewLibrary;
