import { PACKAGE_NAME } from "../utils/constants.js";
import { c } from "../utils/colour.js";
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
 */
export function runList(_argv) {
	printAllComponents(componentMetadata);
}

/**
 * Prints all components grouped by category. Within each category, components
 * are sorted alphabetically by name.
 *
 * @param  {object[]}  components
 *     Component metadata records.
 */
export function printAllComponents(components) {
	const groups = groupByCategory(components);
	const allNames = components.map((component) => component.name);
	const width = Math.max(...allNames.map((name) => name.length));

	console.log(`\n${c.bold("Available components")}\n`);

	for (const [category, items] of groups) {
		console.log(`  ${c.bold(category)}`);

		for (const item of items) {
			console.log(`    ${c.cyan(item.name.padEnd(width))}  ${item.summary}`);
		}

		console.log();
	}

	console.log(
		[
			c.bold("Usage"),
			"",
			`  npx ${PACKAGE_NAME} info <component>`,
			`  npx ${PACKAGE_NAME} snippet <component>`,
			"",
		].join("\n"),
	);
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
