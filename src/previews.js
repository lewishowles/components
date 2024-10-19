import PreviewSection from "@/preview/preview-section.vue";
import PreviewWrapper from "@/preview/preview-wrapper.vue";
import FormLayout from "@/components/form/form-layout/form-layout.vue";

import AlertMessagePreview from "@/components/messaging/alert-message/alert-message-preview.vue";
import ButtonGroupPreview from "@/components/form/button-group/button-group-preview.vue";
import DonutChartPreview from "@/components/chart/donut-chart/donut-chart-preview.vue";
import FormInputPreview from "@/components/form/form-input/form-input-preview.vue";
import FormPreview from "@/components/form/form-preview.vue";
import FormTextareaPreview from "@/components/form/form-textarea/form-textarea-preview.vue";
import ImageTagPreview from "@/components/display/image-tag/image-tag-preview.vue";
import LinkTagPreview from "@/components/interaction/link-tag/link-tag-preview.vue";
import LoadingIndicatorPreview from "@/components/interaction/loading-indicator/loading-indicator-preview.vue";
import PillBadgePreview from "@/components/messaging/pill-badge/pill-badge-preview.vue";
import ProgressBarPreview from "@/components/chart/progress-bar/progress-bar-preview.vue";
import RadioGroupPreview from "@/components/form/radio-group/radio-group-preview.vue";
import SummaryDetailsPreview from "@/components/interaction/summary-details/summary-details-preview.vue";
import UiButtonPreview from "@/components/interaction/ui-button/ui-button-preview.vue";

// Prepare previews for use with <component :is> to simplify preview management.
const previewLibrary = {
	install(app) {
		app.component("AlertMessagePreview", AlertMessagePreview);
		app.component("ButtonGroupPreview", ButtonGroupPreview);
		app.component("DonutChartPreview", DonutChartPreview);
		app.component("FormInputPreview", FormInputPreview);
		app.component("FormLayout", FormLayout);
		app.component("FormPreview", FormPreview);
		app.component("FormTextareaPreview", FormTextareaPreview);
		app.component("ImageTagPreview", ImageTagPreview);
		app.component("LinkTagPreview", LinkTagPreview);
		app.component("LoadingIndicatorPreview", LoadingIndicatorPreview);
		app.component("PillBadgePreview", PillBadgePreview);
		app.component("PreviewSection", PreviewSection);
		app.component("PreviewWrapper", PreviewWrapper);
		app.component("ProgressBarPreview", ProgressBarPreview);
		app.component("RadioGroupPreview", RadioGroupPreview);
		app.component("SummaryDetailsPreview", SummaryDetailsPreview);
		app.component("UiButtonPreview", UiButtonPreview);
	},
};

export default previewLibrary;
