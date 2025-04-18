import PreviewLabel from "@/preview/preview-label.vue";
import PreviewSection from "@/preview/preview-section.vue";
import PreviewWrapper from "@/preview/preview-wrapper.vue";

import AccordionGroupPreview from "@/components/content/accordion-group/accordion-group-preview.vue";
import AlertMessagePreview from "@/components/messaging/alert-message/alert-message-preview.vue";
import AppPaginationPreview from "@/components/navigation/app-pagination/app-pagination-preview.vue";
import BreadcrumbListPreview from "@/components/navigation/breadcrumb-list/breadcrumb-list-preview.vue";
import ButtonGroupPreview from "@/components/form/button-group/button-group-preview.vue";
import DataTablePreview from "@/components/content/data-table/data-table-preview.vue";
import DisplayDatePreview from "@/components/content/display-date/display-date-preview.vue";
import DonutChartPreview from "@/components/chart/donut-chart/donut-chart-preview.vue";
import DropdownMenuPreview from "@/components/interaction/dropdown-menu/dropdown-menu-preview.vue";
import FormCheckboxGroupPreview from "@/components/form/form-checkbox-group/form-checkbox-group-preview.vue";
import FormCheckboxPreview from "@/components/form/form-checkbox/form-checkbox-preview.vue";
import FormDatePreview from "@/components/form/form-date/form-date-preview.vue";
import FormFieldsetPreview from "@/components/form/form-fieldset/form-fieldset-preview.vue";
import FormInputGroupPreview from "@/components/form/form-input-group/form-input-group-preview.vue";
import FormInputPreview from "@/components/form/form-input/form-input-preview.vue";
import FormLayout from "@/components/form/form-layout/form-layout.vue";
import FormRadioGroupPreview from "@/components/form/form-radio-group/form-radio-group-preview.vue";
import FormSelectPreview from "@/components/form/form-select/form-select-preview.vue";
import FormTextareaPreview from "@/components/form/form-textarea/form-textarea-preview.vue";
import FormWrapperPreview from "@/components/form/form-wrapper/form-wrapper-preview.vue";
import IconPreview from "./components/icon/icon-preview.vue";
import ImageTagPreview from "@/components/display/image-tag/image-tag-preview.vue";
import LinkTagPreview from "@/components/interaction/link-tag/link-tag-preview.vue";
import LoadingIndicatorPreview from "@/components/interaction/loading-indicator/loading-indicator-preview.vue";
import ModalDialogPreview from "@/components/messaging/modal-dialog/modal-dialog-preview.vue";
import NotificationHandlerPreview from "@/components/content/notification-handler/notification-handler-preview.vue";
import PillBadgePreview from "@/components/messaging/pill-badge/pill-badge-preview.vue";
import ProgressBarPreview from "@/components/chart/progress-bar/progress-bar-preview.vue";
import SearchableListPreview from "@/components/data/searchable-list/searchable-list-preview.vue";
import SkeletonLoaderPreview from "@/components/content/skeleton-loader/skeleton-loader-preview.vue";
import StarRatingPreview from "@/components/interaction/star-rating/star-rating-preview.vue";
import SummaryDetailsPreview from "@/components/content/summary-details/summary-details-preview.vue";
import TabGroupPreview from "@/components/content/tab-group/tab-group-preview.vue";
import UiButtonPreview from "@/components/interaction/ui-button/ui-button-preview.vue";
import UserAvatarsPreview from "@/components/display/user-avatars/user-avatars-preview.vue";

// Prepare previews for use with <component :is> to simplify preview management.
const previewLibrary = {
	install(app) {
		app.component("AccordionGroupPreview", AccordionGroupPreview);
		app.component("AlertMessagePreview", AlertMessagePreview);
		app.component("AppPaginationPreview", AppPaginationPreview);
		app.component("BreadcrumbListPreview", BreadcrumbListPreview);
		app.component("ButtonGroupPreview", ButtonGroupPreview);
		app.component("DataTablePreview", DataTablePreview);
		app.component("DisplayDatePreview", DisplayDatePreview);
		app.component("DonutChartPreview", DonutChartPreview);
		app.component("DropdownMenuPreview", DropdownMenuPreview);
		app.component("FormCheckboxGroupPreview", FormCheckboxGroupPreview);
		app.component("FormCheckboxPreview", FormCheckboxPreview);
		app.component("FormDatePreview", FormDatePreview);
		app.component("FormFieldsetPreview", FormFieldsetPreview);
		app.component("FormInputGroupPreview", FormInputGroupPreview);
		app.component("FormInputPreview", FormInputPreview);
		app.component("FormLayout", FormLayout);
		app.component("FormRadioGroupPreview", FormRadioGroupPreview);
		app.component("FormSelectPreview", FormSelectPreview);
		app.component("FormTextareaPreview", FormTextareaPreview);
		app.component("FormWrapperPreview", FormWrapperPreview);
		app.component("IconPreview", IconPreview);
		app.component("ImageTagPreview", ImageTagPreview);
		app.component("LinkTagPreview", LinkTagPreview);
		app.component("LoadingIndicatorPreview", LoadingIndicatorPreview);
		app.component("ModalDialogPreview", ModalDialogPreview);
		app.component("NotificationHandlerPreview", NotificationHandlerPreview);
		app.component("PillBadgePreview", PillBadgePreview);
		app.component("PreviewLabel", PreviewLabel);
		app.component("PreviewSection", PreviewSection);
		app.component("PreviewWrapper", PreviewWrapper);
		app.component("ProgressBarPreview", ProgressBarPreview);
		app.component("SearchableListPreview", SearchableListPreview);
		app.component("SkeletonLoaderPreview", SkeletonLoaderPreview);
		app.component("StarRatingPreview", StarRatingPreview);
		app.component("SummaryDetailsPreview", SummaryDetailsPreview);
		app.component("TabGroupPreview", TabGroupPreview);
		app.component("UiButtonPreview", UiButtonPreview);
		app.component("UserAvatarsPreview", UserAvatarsPreview);
	},
};

export default previewLibrary;
