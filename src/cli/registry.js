import { getHelpSection as getListHelpSection } from "./components/list.js";
import { getHelpSection as getPatternHelpSection } from "./components/pattern.js";
import { getHelpSection as getSnippetHelpSection } from "./components/snippet.js";
import { getHelpSection as getStylesheetsHelpSection } from "./stylesheets/index.js";

/**
 * Returns help sections from every registered command group, in display order.
 * Add a new entry here when a command group is introduced.
 *
 * @returns {object[]}
 */
export function getHelpSections() {
	const stylesheets = getStylesheetsHelpSection();

	const components = {
		commands: [
			...getListHelpSection().commands,
			...getSnippetHelpSection().commands,
			...getPatternHelpSection().commands,
		],
		group: "Components",
	};

	return [stylesheets, components];
}
