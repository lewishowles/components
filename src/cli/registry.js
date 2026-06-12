import { getHelpSection as getComponentsHelpSection } from "./components/snippet.js";
import { getHelpSection as getStylesheetsHelpSection } from "./stylesheets/index.js";

/**
 * Returns help sections from every registered command group, in display order.
 * Add a new entry here when a command group is introduced.
 *
 * @returns {object[]}
 */
export function getHelpSections() {
	return [getStylesheetsHelpSection(), getComponentsHelpSection()];
}
