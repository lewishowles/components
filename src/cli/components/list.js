import { divider, style, table } from "@lewishowles/cli-style";
import { PACKAGE_NAME } from "../utils/constants.js";
import { groupBy } from "@lewishowles/helpers/array";
import { componentMetadata } from "./index.js";

export function getHelpSection() {
	return {
		commands: [{ description: "Browse all available components", name: "list" }],
		group: "Components",
	};
}

/**
 * Prints all components grouped by category, each with a one-line summary.
 *
 * @param  {string[]}  _argv
 *     Arguments following the `list` subcommand (reserved for future flags).
 * @param  {object}  ui
 *     A cli-style instance from createCliStyle().
 */
export function runList(_argv, ui) {
	printAllComponents(componentMetadata, ui);
}

/**
 * Prints all components grouped by category. Within each category, components
 * are sorted alphabetically by name.
 *
 * @param  {object[]}  components
 *     Component metadata records.
 * @param  {object}  ui
 *     A cli-style instance from createCliStyle().
 */
export function printAllComponents(components, ui) {
	const groups = groupByCategory(components);
	const lines = ["", style("Available components", "bold", ui.options)];

	for (const [category, items] of groups) {
		lines.push(
			"",
			divider({ label: category, ...ui.options }),
			table({
				columns: [
					{ key: "name", label: "Name" },
					{ key: "summary", label: "Summary" },
				],
				rows: items,
				...ui.options,
			}),
		);
	}

	lines.push(
		"",
		divider({ label: "Usage", ...ui.options }),
		"",
		`  npx ${PACKAGE_NAME} info <component>`,
		`  npx ${PACKAGE_NAME} snippet <component>`,
		"",
	);

	ui.print(lines.join("\n"));
}

/**
 * Groups component metadata records by category, sorted alphabetically within
 * each group. Returns an ordered Map so insertion order determines print order.
 *
 * @param   {object[]}  components
 *     Component metadata records.
 * @returns {Map<string, { name: string, summary: string }[]>}
 */
function groupByCategory(components) {
	const sorted = [...components].sort((a, b) => {
		const categoryOrder = a.category.localeCompare(b.category);

		if (categoryOrder !== 0) {
			return categoryOrder;
		}

		return a.name.localeCompare(b.name);
	});

	const grouped = groupBy(sorted, "category");

	return new Map(
		Object.entries(grouped).map(([category, items]) => [
			category,
			items.map(({ name, summary }) => ({ name, summary })),
		]),
	);
}

export const _test = { groupByCategory };
