import { formActionsMetadata } from "./form/form-actions/form-actions.metadata.js";
import { formFieldMetadata } from "./form/form-field/form-field.metadata.js";
import { formInputMetadata } from "./form/form-input/form-input.metadata.js";
import { formWrapperMetadata } from "./form/form-wrapper/form-wrapper.metadata.js";
import { linkTagMetadata } from "./interaction/link-tag/link-tag.metadata.js";
import { pillBadgeMetadata } from "./messaging/pill-badge/pill-badge.metadata.js";
import { uiButtonMetadata } from "./interaction/ui-button/ui-button.metadata.js";

// Components with shared metadata for docs, snippets, and future CLI commands.
export const componentMetadata = [
	formActionsMetadata,
	formFieldMetadata,
	formInputMetadata,
	formWrapperMetadata,
	linkTagMetadata,
	pillBadgeMetadata,
	uiButtonMetadata,
];

// Components keyed by kebab-case tag name for direct lookup.
export const componentMetadataByName = Object.fromEntries(
	componentMetadata.map((component) => [component.name, component]),
);
