import { buttonGroupMetadata } from "./form/button-group/button-group.metadata.js";
import { formActionsMetadata } from "./form/form-actions/form-actions.metadata.js";
import { formCheckboxGroupMetadata } from "./form/form-checkbox-group/form-checkbox-group.metadata.js";
import { formCheckboxMetadata } from "./form/form-checkbox/form-checkbox.metadata.js";
import { formDateMetadata } from "./form/form-date/form-date.metadata.js";
import { formFieldMetadata } from "./form/form-field/form-field.metadata.js";
import { formFieldsetMetadata } from "./form/form-fieldset/form-fieldset.metadata.js";
import { formInputMetadata } from "./form/form-input/form-input.metadata.js";
import { formInputGroupMetadata } from "./form/form-input-group/form-input-group.metadata.js";
import { formLayoutMetadata } from "./form/form-layout/form-layout.metadata.js";
import { formRadioGroupMetadata } from "./form/form-radio-group/form-radio-group.metadata.js";
import { formSelectMetadata } from "./form/form-select/form-select.metadata.js";
import { formTextareaMetadata } from "./form/form-textarea/form-textarea.metadata.js";
import { formWrapperMetadata } from "./form/form-wrapper/form-wrapper.metadata.js";
import { linkTagMetadata } from "./interaction/link-tag/link-tag.metadata.js";
import { pillBadgeMetadata } from "./messaging/pill-badge/pill-badge.metadata.js";
import { uiButtonMetadata } from "./interaction/ui-button/ui-button.metadata.js";

// Components with shared metadata for docs, snippets, and future CLI commands.
export const componentMetadata = [
	buttonGroupMetadata,
	formActionsMetadata,
	formCheckboxGroupMetadata,
	formCheckboxMetadata,
	formDateMetadata,
	formFieldMetadata,
	formFieldsetMetadata,
	formInputMetadata,
	formInputGroupMetadata,
	formLayoutMetadata,
	formRadioGroupMetadata,
	formSelectMetadata,
	formTextareaMetadata,
	formWrapperMetadata,
	linkTagMetadata,
	pillBadgeMetadata,
	uiButtonMetadata,
];

// Components keyed by kebab-case tag name for direct lookup.
export const componentMetadataByName = Object.fromEntries(
	componentMetadata.map((component) => [component.name, component]),
);
