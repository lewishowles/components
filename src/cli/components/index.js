import { componentMetadata, componentMetadataByName } from "../../components/component-metadata.js";
import { c } from "../utils/colour.js";
import { PACKAGE_NAME } from "../utils/constants.js";

export { componentMetadata };

/**
 * Resolves a component name to its metadata record. Exits with an error if the
 * name is not found.
 *
 * @param   {string}  name
 *     The kebab-case component name to look up.
 * @returns {object}
 */
export function lookupComponent(name) {
	const component = componentMetadataByName[name];

	if (!component) {
		console.error(`Unknown component: ${name}`);
		console.error(`Available: ${componentMetadata.map((component) => component.name).join(", ")}`);
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
 * Prints a list of all components that have snippet examples.
 *
 * @param  {object[]}  components
 *     Component metadata records.
 */
export function printComponents(components) {
	const items = getComponentItems(components);
	const width = Math.max(...items.map((item) => item.name.length));

	console.log(`\n${c.bold("Available snippet components")}\n`);

	for (const item of items) {
		const exampleText = item.examples === 1 ? "1 example" : `${item.examples} examples`;

		console.log(
			`  ${c.cyan(item.name.padEnd(width))}  ${item.summary} ${c.dim(`(${exampleText})`)}`,
		);
	}

	console.log(`
${c.bold("Usage")}

  npx ${PACKAGE_NAME} snippet <component> --list
`);
}

/**
 * Prints the list of snippet examples for one component.
 *
 * @param  {object}  component
 *     Component metadata record.
 */
export function printExamples(component) {
	const items = getExampleItems(component);
	const width = Math.max(...items.map((item) => item.name.length));

	console.log(`\n${c.bold(`Snippet examples for ${component.name}`)}\n`);

	for (const item of items) {
		console.log(`  ${c.cyan(item.name.padEnd(width))}  ${item.summary}`);
	}

	console.log(`
${c.bold("Usage")}

  npx ${PACKAGE_NAME} snippet ${component.name} <example>
`);
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
 * Gets display-ready items from component metadata, sorted alphabetically by
 * name.
 *
 * @param   {object[]}  components
 * @returns {{ examples: number, name: string, summary: string }[]}
 */
function getComponentItems(components) {
	return components
		.map((component) => ({
			examples: component.examples.length,
			name: component.name,
			summary: component.summary,
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
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

export const _test = { getComponentItems, getExampleItems };
