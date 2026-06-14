import { PACKAGE_NAME } from "../utils/constants.js";
import { c } from "../utils/colour.js";
import { createInterface } from "node:readline";
import { patterns, patternsByName } from "./patterns.js";

export function getHelpSection() {
	return {
		commands: [{ description: "Generate multi-component UI patterns", name: "pattern" }],
		group: "Components",
	};
}

/**
 * Parses pattern command arguments into flags and an optional pattern name.
 *
 * @param  {string[]}  argv
 *     Arguments following the `pattern` subcommand.
 * @returns {{ flags: { help: boolean, list: boolean }, name: string | null }}
 */
export function parsePatternArguments(argv) {
	const flags = { help: false, list: false };

	let name = null;

	for (const argument of argv) {
		if (argument === "--list" || argument === "-l") {
			flags.list = true;
			continue;
		}

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
 * Looks up a pattern by name. Exits with an error if the name is not found.
 *
 * @param   {string}  name
 *     The pattern name to look up.
 * @returns {object}
 */
export function lookupPattern(name) {
	const pattern = patternsByName[name];

	if (!pattern) {
		console.error(`Unknown pattern: ${name}`);
		console.error(`Available: ${patterns.map((pattern) => pattern.name).join(", ")}`);
		process.exit(1);
	}

	return pattern;
}

/**
 * Returns the template string for a named pattern, prefixed with a stability
 * comment and a leading blank line so the output is visually separate from the
 * terminal prompt.
 *
 * @param   {object}  pattern
 *     A pattern record.
 * @returns {string}
 */
export function generatePattern(pattern) {
	const stabilityNote = `<!-- [${pattern.stability}] Adapt field names, labels, and validation to your requirements. -->`;

	return `\n${stabilityNote}\n${pattern.template}`;
}

/**
 * Prints all available patterns grouped by category, with a single illustrative
 * note as a footer.
 */
export function printPatterns() {
	const items = getPatternItems();

	if (!items.length) {
		console.log(`\n${c.dim("No patterns available.")}\n`);

		return;
	}

	const grouped = groupByCategory(items);

	console.log(`\n${c.bold("Available patterns")}\n`);

	for (const [category, categoryItems] of Object.entries(grouped)) {
		const width = Math.max(...categoryItems.map((item) => item.name.length));

		console.log(`  ${c.bold(capitalise(category))}\n`);

		for (const item of categoryItems) {
			console.log(`    ${c.cyan(item.name.padEnd(width))}  ${item.summary}`);
		}

		console.log();
	}

	console.log(`  ${c.dim("All patterns are illustrative — adapt to your requirements.")}`);
	console.log(`
${c.bold("Usage")}

  npx ${PACKAGE_NAME} pattern <name>
`);
}

/**
 * Discovers or generates a pattern. With --list or --help, prints available
 * patterns. With a pattern name, prints the template. With no arguments and an
 * interactive terminal, prompts the user to pick from a numbered list.
 *
 * @param  {string[]}  rawArguments
 *     Arguments following the `pattern` subcommand.
 */
export async function runPattern(rawArguments) {
	const { flags, name } = parsePatternArguments(rawArguments);

	if (flags.help || (flags.list && name === null)) {
		printPatterns();

		return;
	}

	if (name !== null) {
		console.log(generatePattern(lookupPattern(name)));

		return;
	}

	if (!process.stdin.isTTY) {
		console.error(`Usage: npx ${PACKAGE_NAME} pattern <name>\n`);
		process.exit(1);
	}

	const selected = await promptPattern();

	console.log(generatePattern(lookupPattern(selected)));
}

/**
 * Shows a numbered list of patterns and prompts the user to pick one by name
 * or number. Resolves with the selected pattern name.
 *
 * @returns {Promise<string>}
 */
async function promptPattern() {
	const items = getPatternItems();
	const grouped = groupByCategory(items);

	console.log(`\n${c.bold("Available patterns")}\n`);

	// Build a flat ordered list so number picks map back to names.
	const ordered = [];

	let index = 1;

	for (const [category, categoryItems] of Object.entries(grouped)) {
		const width = Math.max(...categoryItems.map((item) => item.name.length));

		console.log(`  ${c.bold(capitalise(category))}\n`);

		for (const item of categoryItems) {
			console.log(
				`    ${c.dim(String(index).padStart(2))}  ${c.cyan(item.name.padEnd(width))}  ${item.summary}`,
			);

			ordered.push(item.name);
			index++;
		}

		console.log();
	}

	const rl = createInterface({ input: process.stdin, output: process.stdout });

	return new Promise((resolve) => {
		rl.question(`Pattern name or number: `, (answer) => {
			rl.close();

			const trimmed = answer.trim();
			const byNumber = parseInt(trimmed, 10);
			const isValidNumber = !isNaN(byNumber) && byNumber >= 1 && byNumber <= ordered.length;

			resolve(isValidNumber ? ordered[byNumber - 1] : trimmed);
		});
	});
}

/**
 * Gets display-ready items from pattern data, sorted alphabetically by name
 * within each category.
 *
 * @returns {{ category: string, name: string, summary: string }[]}
 */
function getPatternItems() {
	return patterns
		.map((pattern) => ({
			category: pattern.category,
			name: pattern.name,
			summary: pattern.summary,
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Groups an array of items by their category, preserving insertion order of
 * categories.
 *
 * @param   {{ category: string }[]}  items
 * @returns {Record<string, object[]>}
 */
function groupByCategory(items) {
	const groups = {};

	for (const item of items) {
		if (!groups[item.category]) {
			groups[item.category] = [];
		}

		groups[item.category].push(item);
	}

	return groups;
}

/**
 * Capitalises the first character of a string.
 *
 * @param   {string}  string
 * @returns {string}
 */
function capitalise(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export const _test = { getPatternItems, groupByCategory };
