import { accordionGroupMetadata } from "./content/accordion-group/accordion-group.metadata.js";
import { accordionPanelMetadata } from "./content/accordion-panel/accordion-panel.metadata.js";
import { alertMessageMetadata } from "./messaging/alert-message/alert-message.metadata.js";
import { appPaginationMetadata } from "./navigation/app-pagination/app-pagination.metadata.js";
import { baseModalMetadata } from "./messaging/base-modal/base-modal.metadata.js";
import { breadcrumbItemMetadata } from "./navigation/breadcrumb-item/breadcrumb-item.metadata.js";
import { breadcrumbListMetadata } from "./navigation/breadcrumb-list/breadcrumb-list.metadata.js";
import { buttonGroupMetadata } from "./form/button-group/button-group.metadata.js";
import { comboBoxMetadata } from "./content/combo-box/combo-box.metadata.js";
import { contentCardMetadata } from "./content/content-card/content-card.metadata.js";
import { contentSeparatorMetadata } from "./content/content-separator/content-separator.metadata.js";
import { dataTableMetadata } from "./content/data-table/data-table.metadata.js";
import { displayDateMetadata } from "./content/display-date/display-date.metadata.js";
import { flashMessagesMetadata } from "./content/flash-messages/flash-messages.metadata.js";
import { floatingDetailsMetadata } from "./content/floating-details/floating-details.metadata.js";
import { formActionsMetadata } from "./form/form-actions/form-actions.metadata.js";
import { formCheckboxGroupMetadata } from "./form/form-checkbox-group/form-checkbox-group.metadata.js";
import { formCheckboxMetadata } from "./form/form-checkbox/form-checkbox.metadata.js";
import { formDateMetadata } from "./form/form-date/form-date.metadata.js";
import { formFieldMetadata } from "./form/form-field/form-field.metadata.js";
import { formFieldsetMetadata } from "./form/form-fieldset/form-fieldset.metadata.js";
import { formInputGroupMetadata } from "./form/form-input-group/form-input-group.metadata.js";
import { formInputMetadata } from "./form/form-input/form-input.metadata.js";
import { formLayoutMetadata } from "./form/form-layout/form-layout.metadata.js";
import { formRadioGroupMetadata } from "./form/form-radio-group/form-radio-group.metadata.js";
import { formSelectMetadata } from "./form/form-select/form-select.metadata.js";
import { formTextareaMetadata } from "./form/form-textarea/form-textarea.metadata.js";
import { formWrapperMetadata } from "./form/form-wrapper/form-wrapper.metadata.js";
import { linkTagMetadata } from "./interaction/link-tag/link-tag.metadata.js";
import { loadingIndicatorMetadata } from "./content/loading-indicator/loading-indicator.metadata.js";
import { loadingSpinnerMetadata } from "./content/loading-spinner/loading-spinner.metadata.js";
import { modalControllerMetadata } from "./messaging/modal-controller/modal-controller.metadata.js";
import { modalDialogActionsMetadata } from "./messaging/modal-dialog-actions/modal-dialog-actions.metadata.js";
import { modalDialogMetadata } from "./messaging/modal-dialog/modal-dialog.metadata.js";
import { modalDialogTitleMetadata } from "./messaging/modal-dialog-title/modal-dialog-title.metadata.js";
import { noneFoundMetadata } from "./content/none-found/none-found.metadata.js";
import { notificationHandlerMetadata } from "./messaging/notification-handler/notification-handler.metadata.js";
import { pillBadgeMetadata } from "./messaging/pill-badge/pill-badge.metadata.js";
import { relativeDateMetadata } from "./content/relative-date/relative-date.metadata.js";
import { searchableListMetadata } from "./content/searchable-list/searchable-list.metadata.js";
import { stepIndicatorMetadata } from "./messaging/step-indicator/step-indicator.metadata.js";
import { summaryDetailsMetadata } from "./content/summary-details/summary-details.metadata.js";
import { tabGroupMetadata } from "./content/tab-group/tab-group.metadata.js";
import { tabItemMetadata } from "./content/tab-item/tab-item.metadata.js";
import { uiButtonMetadata } from "./interaction/ui-button/ui-button.metadata.js";

// Components with shared metadata for docs, snippets, and future CLI commands.
export const componentMetadata = [
	accordionGroupMetadata,
	accordionPanelMetadata,
	alertMessageMetadata,
	appPaginationMetadata,
	baseModalMetadata,
	breadcrumbItemMetadata,
	breadcrumbListMetadata,
	buttonGroupMetadata,
	comboBoxMetadata,
	contentCardMetadata,
	contentSeparatorMetadata,
	dataTableMetadata,
	displayDateMetadata,
	flashMessagesMetadata,
	floatingDetailsMetadata,
	formActionsMetadata,
	formCheckboxGroupMetadata,
	formCheckboxMetadata,
	formDateMetadata,
	formFieldMetadata,
	formFieldsetMetadata,
	formInputGroupMetadata,
	formInputMetadata,
	formLayoutMetadata,
	formRadioGroupMetadata,
	formSelectMetadata,
	formTextareaMetadata,
	formWrapperMetadata,
	linkTagMetadata,
	loadingIndicatorMetadata,
	loadingSpinnerMetadata,
	modalControllerMetadata,
	modalDialogActionsMetadata,
	modalDialogMetadata,
	modalDialogTitleMetadata,
	noneFoundMetadata,
	notificationHandlerMetadata,
	pillBadgeMetadata,
	relativeDateMetadata,
	searchableListMetadata,
	stepIndicatorMetadata,
	summaryDetailsMetadata,
	tabGroupMetadata,
	tabItemMetadata,
	uiButtonMetadata,
];

// Components keyed by kebab-case tag name for direct lookup.
export const componentMetadataByName = Object.fromEntries(
	componentMetadata.map((component) => [component.name, component]),
);
