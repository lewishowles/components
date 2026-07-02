import { divider, style, table } from "@lewishowles/cli-style";
import { componentMetadata, componentMetadataByName } from "../../components/component-metadata.js";
import { PACKAGE_NAME } from "../utils/constants.js";
import { printUnknownItemError } from "../utils/unknown-item-error.js";
import { printAllComponents } from "./list.js";

export { componentMetadata };

/**
 * Resolves a component name to its metadata record. Exits with an error if the
 * name is not found, printing the same listing `list`/`info --help` show.
 *
 * @param   {string}  name
 *     The kebab-case component name to look up.
 * @param   {object}  ui
 *     A cli-style instance from createCliStyle().
 * @returns {object}
 */
export function lookupComponent(name, ui) {
	const component = componentMetadataByName[name];

	if (!component) {
		printUnknownItemError("component", name, ui);
		printAllComponents(componentMetadata, ui);
		process.exit(1);
	}

	return component;
}

/**
 * Converts snippet prop and event data into an ordered array of Vue template
 * attribute strings. Props are output first, then events.
 *
 * Rendering rules per prop entry:
 *   - isInline: true   → name="value"     (plain HTML string attribute)
 *   - isVariable: true → :name="value"    (v-bind to a named JS variable)
 *   - type: "boolean"  → name             (bare, when value is true)
 *                      → :name="false"    (when value is false)
 *   - otherwise        → :name="value"    (bound JS expression)
 *
 * @param  {object}  snippet
 *     The example's snippet object, containing props and events.
 * @returns {string[]}
 */
export function buildTemplateAttributes(snippet) {
	const attrs = [];

	for (const [key, config] of Object.entries(snippet.props ?? {})) {
		const name = toKebabCase(key);
		const { isInline, isVariable, type, value } = config;

		if (isInline) {
			attrs.push(`${name}="${value}"`);
		} else if (isVariable) {
			attrs.push(`:${name}="${value}"`);
		} else if (type === "boolean") {
			attrs.push(value === true ? name : `:${name}="false"`);
		} else {
			attrs.push(`:${name}="${value}"`);
		}
	}

	for (const [event, config] of Object.entries(snippet.events ?? {})) {
		attrs.push(`@${event}="${config.value}"`);
	}

	return attrs;
}

/**
 * Prints the list of snippet examples for one component.
 *
 * @param  {object}  component
 *     Component metadata record.
 * @param  {object}  ui
 *     A cli-style instance from createCliStyle().
 */
export function printExamples(component, ui) {
	const items = getExampleItems(component);

	const lines = [
		"",
		style(`Snippet examples for ${component.name}`, "bold", ui.options),
		"",
		table({
			columns: [
				{ key: "name", label: "Name" },
				{ key: "summary", label: "Summary" },
			],
			rows: items,
			...ui.options,
		}),
		"",
		divider({ label: "Usage", ...ui.options }),
		"",
		`  npx ${PACKAGE_NAME} snippet ${component.name} <example>`,
		"",
	];

	ui.print(lines.join("\n"));
}

/**
 * Converts a camelCase string to kebab-case for use in Vue templates.
 *
 * @param   {string}  str
 * @returns {string}
 */
function toKebabCase(str) {
	return str.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

/**
 * Gets display-ready items from component examples.
 *
 * @param   {object}  component
 * @returns {{ name: string, summary: string }[]}
 */
function getExampleItems(component) {
	return component.examples.map((example) => ({
		name: example.name,
		summary: example.summary,
	}));
}

export const _test = { getExampleItems };
