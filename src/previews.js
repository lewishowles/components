import PreviewSection from "@/preview/preview-section.vue";
import PreviewWrapper from "@/preview/preview-wrapper.vue";

import AlertMessagePreview from "@/components/messaging/alert-message/alert-message-preview.vue";
import AppPaginationPreview from "@/components/navigation/app-pagination/app-pagination-preview.vue";
import BreadcrumbListPreview from "@/components/navigation/breadcrumb-list/breadcrumb-list-preview.vue";
import ButtonGroupPreview from "@/components/form/button-group/button-group-preview.vue";
import DonutChartPreview from "@/components/chart/donut-chart/donut-chart-preview.vue";
import DropdownMenuPreview from "@/components/interaction/dropdown-menu/dropdown-menu-preview.vue";
import FormCheckboxPreview from "@/components/form/form-checkbox/form-checkbox-preview.vue";
import FormInputPreview from "@/components/form/form-input/form-input-preview.vue";
import FormLayout from "@/components/form/form-layout/form-layout.vue";
import FormTextareaPreview from "@/components/form/form-textarea/form-textarea-preview.vue";
import FormWrapperPreview from "@/components/form/form-wrapper/form-wrapper-preview.vue";
import ImageTagPreview from "@/components/display/image-tag/image-tag-preview.vue";
import LinkTagPreview from "@/components/interaction/link-tag/link-tag-preview.vue";
import LoadingIndicatorPreview from "@/components/interaction/loading-indicator/loading-indicator-preview.vue";
import ModalDialogPreview from "@/components/messaging/modal-dialog/modal-dialog-preview.vue";
import PillBadgePreview from "@/components/messaging/pill-badge/pill-badge-preview.vue";
import ProgressBarPreview from "@/components/chart/progress-bar/progress-bar-preview.vue";
import RadioGroupPreview from "@/components/form/radio-group/radio-group-preview.vue";
import SearchableListPreview from "@/components/data/searchable-list/searchable-list-preview.vue";
import SkeletonLoaderPreview from "@/components/content/skeleton-loader/skeleton-loader-preview.vue";
import SummaryDetailsPreview from "@/components/content/summary-details/summary-details-preview.vue";
import TabGroupPreview from "@/components/content/tab-group/tab-group-preview.vue";
import UiButtonPreview from "@/components/interaction/ui-button/ui-button-preview.vue";

// Prepare previews for use with <component :is> to simplify preview management.
const previewLibrary = {
	install(app) {
		app.component("AlertMessagePreview", AlertMessagePreview);
		app.component("AppPaginationPreview", AppPaginationPreview);
		app.component("BreadcrumbListPreview", BreadcrumbListPreview);
		app.component("ButtonGroupPreview", ButtonGroupPreview);
		app.component("DonutChartPreview", DonutChartPreview);
		app.component("DropdownMenuPreview", DropdownMenuPreview);
		app.component("FormCheckboxPreview", FormCheckboxPreview);
		app.component("FormInputPreview", FormInputPreview);
		app.component("FormLayout", FormLayout);
		app.component("FormTextareaPreview", FormTextareaPreview);
		app.component("FormWrapperPreview", FormWrapperPreview);
		app.component("ImageTagPreview", ImageTagPreview);
		app.component("LinkTagPreview", LinkTagPreview);
		app.component("LoadingIndicatorPreview", LoadingIndicatorPreview);
		app.component("ModalDialogPreview", ModalDialogPreview);
		app.component("PillBadgePreview", PillBadgePreview);
		app.component("PreviewSection", PreviewSection);
		app.component("PreviewWrapper", PreviewWrapper);
		app.component("ProgressBarPreview", ProgressBarPreview);
		app.component("RadioGroupPreview", RadioGroupPreview);
		app.component("SearchableListPreview", SearchableListPreview);
		app.component("SkeletonLoaderPreview", SkeletonLoaderPreview);
		app.component("SummaryDetailsPreview", SummaryDetailsPreview);
		app.component("TabGroupPreview", TabGroupPreview);
		app.component("UiButtonPreview", UiButtonPreview);
	},
};

export default previewLibrary;
