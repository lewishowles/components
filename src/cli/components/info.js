import { chip, divider, foreground, style, table } from "@lewishowles/cli-style";
import { PACKAGE_NAME } from "../utils/constants.js";
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
 * @param  {object}  ui
 *     A cli-style instance from createCliStyle().
 */
export function runInfo(argv, ui) {
	const { flags, name } = parseInfoArguments(argv);

	if (flags.help || name === null) {
		printAllComponents(componentMetadata, ui);

		return;
	}

	printInfo(lookupComponent(name), ui);
}

/**
 * Prints the full API reference for one component.
 *
 * @param  {object}  component
 *     Component metadata record.
 * @param  {object}  ui
 *     A cli-style instance from createCliStyle().
 */
export function printInfo(component, ui) {
	const lines = [
		"",
		`${style(component.name, "bold", ui.options)}  ${foreground(component.category, "muted", ui.options)}`,
		`${component.summary}`,
	];

	pushSection(
		lines,
		"Props",
		(component.props ?? []).map((prop) => formatProp(prop, ui)),
		ui,
		propColumns,
	);
	pushSection(
		lines,
		"Slots",
		(component.slots ?? []).map((slot) => formatSlot(slot, ui)),
		ui,
	);
	pushSection(
		lines,
		"Events",
		(component.events ?? []).map((event) => ({ description: event.summary, name: event.name })),
		ui,
	);
	pushSection(
		lines,
		"Methods",
		(component.methods ?? []).map((method) => ({ description: method.summary, name: method.name })),
		ui,
	);
	pushSection(
		lines,
		"Parts",
		(component.parts ?? []).map((part) => ({ description: part.summary, name: part.name })),
		ui,
	);

	lines.push(
		"",
		divider({ label: "Usage", ...ui.options }),
		"",
		`  npx ${PACKAGE_NAME} snippet ${component.name}`,
		"",
	);

	ui.print(lines.join("\n"));
}

// The default two-column shape used by every section except Props.
const defaultColumns = [
	{ key: "name", label: "Name" },
	{ key: "description", label: "Description" },
];

// Props get their own Type column instead of folding it into Description.
const propColumns = [
	{ key: "name", label: "Name" },
	{ key: "type", label: "Type" },
	{ key: "description", label: "Description" },
];

/**
 * Appends a labelled table section to the output when rows are present.
 *
 * @param  {string[]}   lines
 *     The lines accumulator to push onto.
 * @param  {string}     label
 *     The section heading.
 * @param  {object[]}   rows
 *     Table rows, matching the shape of `columns`.
 * @param  {object}     ui
 *     A cli-style instance from createCliStyle().
 * @param  {object[]}   [columns]
 *     Table columns; defaults to a `{ name, description }` shape.
 */
function pushSection(lines, label, rows, ui, columns = defaultColumns) {
	if (!rows.length) {
		return;
	}

	lines.push("", divider({ label, ...ui.options }), table({ columns, rows, ...ui.options }));
}

/**
 * Renders a default value as a trailing chip, so it reads as a distinct
 * badge after the description rather than competing with it for the same
 * column, and without needing a dedicated Default column.
 *
 * @param   {unknown}  defaultValue
 * @param   {object}   ui
 *     A cli-style instance from createCliStyle().
 * @returns {string}
 */
function formatDefault(defaultValue, ui) {
	if (defaultValue === null || defaultValue === undefined) {
		return "";
	}

	return ` ${chip(`default: ${defaultValue}`, "neutral", ui.options)}`;
}

/**
 * Converts a prop metadata record into a display row. The description
 * carries a trailing default chip; type gets its own column.
 *
 * @param   {object}  prop
 * @param   {object}  ui
 *     A cli-style instance from createCliStyle().
 * @returns {{ description: string, name: string, type: string }}
 */
function formatProp(prop, ui) {
	return {
		description: `${prop.summary}${formatDefault(prop.default, ui)}`,
		name: prop.name,
		type: prop.type ?? "",
	};
}

/**
 * Converts a slot metadata record into a display row. The description
 * carries a trailing default chip when one is defined.
 *
 * @param   {object}  slot
 * @param   {object}  ui
 *     A cli-style instance from createCliStyle().
 * @returns {{ description: string, name: string }}
 */
function formatSlot(slot, ui) {
	return {
		description: `${slot.summary}${formatDefault(slot.default, ui)}`,
		name: slot.name,
	};
}

export const _test = { formatDefault, formatProp, formatSlot, parseInfoArguments, pushSection };
