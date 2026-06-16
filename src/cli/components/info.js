import { PACKAGE_NAME } from "../utils/constants.js";
import { c } from "../utils/colour.js";
import { componentMetadata, lookupComponent } from "./index.js";
import { printAllComponents } from "./list.js";

export function getHelpSection() {
	return {
		commands: [
			{ description: "Show props, slots, and events for a component", name: "info <component>" },
		],
		group: "Components",
	};
}

/**
 * Parses info command arguments into a component name and flags.
 *
 * @param  {string[]}  argv
 *     Arguments following the `info` subcommand.
 * @returns {{ flags: { help: boolean }, name: string | null }}
 */
export function parseInfoArguments(argv) {
	const flags = { help: false };

	let name = null;

	for (const argument of argv) {
		if (argument === "--help" || argument === "-h") {
			flags.help = true;
			continue;
		}

		if (argument.startsWith("-")) {
			continue;
		}

		if (name === null) {
			name = argument;
		}
	}

	return { flags, name };
}

/**
 * Prints the API reference for a named component: props, slots, events,
 * methods, and parts drawn from the hand-authored metadata record.
 *
 * @param  {string[]}  argv
 *     Arguments following the `info` subcommand.
 */
export function runInfo(argv) {
	const { flags, name } = parseInfoArguments(argv);

	if (flags.help || name === null) {
		printAllComponents(componentMetadata);

		return;
	}

	printInfo(lookupComponent(name));
}

/**
 * Prints the full API reference for one component.
 *
 * @param  {object}  component
 *     Component metadata record.
 */
export function printInfo(component) {
	const lines = [
		"",
		`${c.bold(component.name)}  ${c.dim(component.category)}`,
		`${component.summary}`,
	];

	const props = component.props ?? [];
	const slots = component.slots ?? [];
	const events = component.events ?? [];
	const methods = component.methods ?? [];
	const parts = component.parts ?? [];

	if (props.length) {
		lines.push("", c.bold("Props"));
		lines.push(...formatTable(props.map((prop) => formatProp(prop))));
	}

	if (slots.length) {
		lines.push("", c.bold("Slots"));
		lines.push(...formatTable(slots.map((slot) => formatSlot(slot))));
	}

	if (events.length) {
		lines.push("", c.bold("Events"));
		lines.push(...formatTable(events.map((event) => [event.name, event.summary])));
	}

	if (methods.length) {
		lines.push("", c.bold("Methods"));
		lines.push(...formatTable(methods.map((method) => [method.name, method.summary])));
	}

	if (parts.length) {
		lines.push("", c.bold("Parts"));
		lines.push(...formatTable(parts.map((part) => [part.name, part.summary])));
	}

	lines.push("", c.bold("Usage"), "", `  npx ${PACKAGE_NAME} snippet ${component.name}`, "");

	console.log(lines.join("\n"));
}

/**
 * Converts a prop metadata record into a display row. The first column is the
 * prop name; the second carries the type, default, and summary.
 *
 * @param   {object}  prop
 * @returns {string[]}
 */
function formatProp(prop) {
	const typePart = c.dim(prop.type ?? "");

	const defaultPart =
		prop.default !== null && prop.default !== undefined ? c.dim(`= ${prop.default}`) : "";

	const meta = [typePart, defaultPart].filter(Boolean).join("  ");

	return [prop.name, meta ? `${meta}  ${prop.summary}` : prop.summary];
}

/**
 * Converts a slot metadata record into a display row. Appends the default
 * value when one is defined.
 *
 * @param   {object}  slot
 * @returns {string[]}
 */
function formatSlot(slot) {
	const defaultPart =
		slot.default !== null && slot.default !== undefined ? c.dim(`= ${slot.default}`) : "";

	return [slot.name, defaultPart ? `${slot.summary}  ${defaultPart}` : slot.summary];
}

/**
 * Aligns a list of two-column rows by padding the first column to a uniform
 * width, then indents each row by two spaces.
 *
 * @param   {string[][]}  rows
 * @returns {string[]}
 */
function formatTable(rows) {
	const width = Math.max(...rows.map(([name]) => name.length));

	return rows.map(([name, description]) => `  ${c.cyan(name.padEnd(width))}  ${description}`);
}

export const _test = { formatProp, formatSlot, formatTable, parseInfoArguments };
