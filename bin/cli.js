#!/usr/bin/env node

import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	readdirSync,
	rmSync,
	writeFileSync,
} from "node:fs";

import { createInterface } from "node:readline";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
	componentMetadata,
	componentMetadataByName,
} from "../src/components/component-metadata.js";

// Absolute path to this file's directory (bin/).
const __dirname = dirname(fileURLToPath(import.meta.url));

// Absolute path to the shipped CSS directory.
const CSS_DIR = join(__dirname, "../dist/css");

// Package manifest — used for the version number and package name.
const PKG = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf8"));

// Unpack the fields we need from the manifest.
const { name: PACKAGE_NAME, version: VERSION } = PKG;

// Default destination directory, relative to the user's project root.
const DEFAULT_DEST = "src/assets/css";

// Short descriptions for each shipped stylesheet, shown in the list view.
const SHEET_DESCRIPTIONS = {
	animation: "Keyframe animations and utility classes",
	buttons: "Button variants and states",
	components: "Component-specific CSS that Tailwind can't express",
	font: "Font-face declarations",
	form: "Form control base styles",
	main: "Consumer baseline (container queries, hocus)",
	theme: "Design token CSS variables",
};

// Whether to emit ANSI colour codes — disabled when stdout isn't a TTY or NO_COLOR is set.
const useColour = process.stdout.isTTY && !process.env.NO_COLOR;

// ANSI colour helpers — fall through to plain text when colours are disabled.
const c = {
	bold: (text) => (useColour ? `\x1b[1m${text}\x1b[0m` : text),
	cyan: (text) => (useColour ? `\x1b[36m${text}\x1b[0m` : text),
	dim: (text) => (useColour ? `\x1b[2m${text}\x1b[0m` : text),
	green: (text) => (useColour ? `\x1b[32m${text}\x1b[0m` : text),
	yellow: (text) => (useColour ? `\x1b[33m${text}\x1b[0m` : text),
};

/**
 * Returns the list of available stylesheet names (without extension), sorted
 * alphabetically. Exits early if the CSS directory doesn't exist.
 *
 * @returns  {string[]}
 */
function getSheets() {
	if (!existsSync(CSS_DIR)) {
		console.error(`CSS directory not found: ${CSS_DIR}`);
		console.error("Run `bun run build` first.");
		process.exit(1);
	}

	return readdirSync(CSS_DIR)
		.filter((file) => file.endsWith(".css"))
		.map((file) => file.replace(".css", ""))
		.sort();
}

/**
 * Builds the provenance header stamped at the top of every copied file.
 *
 * @param  {string}  filename
 *     The stylesheet filename, e.g. `buttons.css`.
 * @returns {string}
 */
function provenanceHeader(filename) {
	const name = filename.replace(".css", "");

	return `/* Copied from ${PACKAGE_NAME}@${VERSION} — ${filename}. Compare: npx ${PACKAGE_NAME} diff ${name} */\n`;
}

/**
 * Strips a provenance header from the top of a CSS string so the remaining
 * content can be compared against the pristine source.
 *
 * @param  {string}  content
 *     Raw CSS content, potentially with a header.
 * @returns {string}
 */
function stripProvenance(content) {
	return content.replace(/^\/\* Copied from [^\n]+\*\/\n/, "");
}

/**
 * Parses CLI arguments into named flags and positional sheet names.
 *
 * @param  {string[]}  argv
 *     Arguments following the subcommand name.
 * @returns {{ names: string[], flags: { all: boolean, force: boolean, dest: string } }}
 */
function parseArgs(argv) {
	const flags = { all: false, dest: DEFAULT_DEST, force: false };
	const names = [];

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg === "--all") {
			flags.all = true;
		} else if (arg === "--force" || arg === "-f") {
			flags.force = true;
		} else if ((arg === "--dest" || arg === "-d") && argv[i + 1]) {
			flags.dest = argv[++i];
		} else if (!arg.startsWith("-")) {
			names.push(arg.replace(/\.css$/, ""));
		}
	}

	return { flags, names };
}

/**
 * Parses snippet command arguments into flags, a component name, and an
 * optional example name.
 *
 * @param  {string[]}  argv
 *     Arguments following the `snippet` subcommand.
 * @returns {{ example: string | null, flags: { list: boolean }, name: string | null }}
 */
function parseSnippetArgs(argv) {
	const flags = { list: false };

	let example = null;
	let name = null;

	for (const arg of argv) {
		if (arg === "--list" || arg === "-l") {
			flags.list = true;
			continue;
		}

		if (arg.startsWith("-")) {
			continue;
		}

		if (name === null) {
			name = arg;
		} else if (example === null) {
			example = arg;
		}
	}

	return { example, flags, name };
}

/**
 * Converts a camelCase string to kebab-case for use in Vue templates.
 *
 * @param   {string}  str
 *     The string to convert.
 * @returns {string}
 */
function toKebabCase(str) {
	return str.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

/**
 * Creates display rows for all known snippet components.
 *
 * @param  {object[]}  components
 *     Component metadata records.
 * @returns {object[]}
 */
function getSnippetComponentRows(components) {
	return components
		.map((component) => ({
			examples: component.examples.length,
			name: component.name,
			summary: component.summary,
		}))
		.sort((componentA, componentB) => componentA.name.localeCompare(componentB.name));
}

/**
 * Creates display rows for one component's examples.
 *
 * @param   {object}  component
 *     Component metadata record.
 * @returns {object[]}
 */
function getSnippetExampleRows(component) {
	return component.examples.map((example) => ({
		name: example.name,
		summary: example.summary,
	}));
}

/**
 * Resolves a component name to its metadata record. Exits with an error if the
 * name is not found.
 *
 * @param   {string}  name
 *     The kebab-case component name to look up.
 * @returns {object}
 */
function lookupComponent(name) {
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
 * @param   {object}    snippet
 *     The example's snippet object, containing props and events.
 * @returns {string[]}
 */
function buildSnippetAttributes(snippet) {
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
 * Generates a copyable Vue template snippet for a named component example.
 * Exits with an error if the example is not found or has no snippet data.
 *
 * @param   {object}  component
 *     Component metadata record.
 * @param   {string}  exampleName
 *     The name of the example to generate.
 * @returns {string}
 */
function generateSnippet(component, exampleName) {
	const example = component.examples.find((example) => example.name === exampleName);

	if (!example) {
		console.error(`Unknown example: ${exampleName}`);
		console.error(`Available: ${component.examples.map((example) => example.name).join(", ")}`);
		process.exit(1);
	}

	if (!example.snippet) {
		console.error(`Example "${exampleName}" has no snippet data.`);
		process.exit(1);
	}

	const { snippet } = example;
	const attrs = buildSnippetAttributes(snippet);
	const attrString = attrs.length ? " " + attrs.join(" ") : "";
	const slotContent = snippet.slots?.default?.value ?? null;

	if (slotContent === null) {
		return `<${component.name}${attrString} />`;
	}

	return `<${component.name}${attrString}>\n  ${slotContent}\n</${component.name}>`;
}

/**
 * Prints the list of available stylesheets, a description of each command,
 * and usage examples.
 *
 * @param  {string[]}  sheets
 *     Available stylesheet names.
 */
function printList(sheets) {
	const width = Math.max(...sheets.map((sheet) => sheet.length));

	console.log(`\n${c.bold("Available stylesheets")}\n`);

	for (const sheet of sheets) {
		const description = SHEET_DESCRIPTIONS[sheet] ?? "";

		console.log(`  ${c.cyan(sheet.padEnd(width))}  ${description}`);
	}

	console.log(`
${c.bold("Commands")}

	${c.bold("copy")}  Copy one or more sheets into your project ${c.dim(`(default destination: ${DEFAULT_DEST})`)}
	${c.bold("diff")}  Compare your local copies against the currently installed version
	${c.bold("snippet")}  Discover copyable component examples

${c.bold("Usage")}

	npx ${PACKAGE_NAME} copy buttons theme
	npx ${PACKAGE_NAME} copy --all ${c.dim(`[--dest ${DEFAULT_DEST}]`)} ${c.dim("[--force]")}

	npx ${PACKAGE_NAME} diff buttons
	npx ${PACKAGE_NAME} diff --all ${c.dim(`[--dest ${DEFAULT_DEST}]`)}

	npx ${PACKAGE_NAME} snippet --list

	npx ${PACKAGE_NAME} snippet ui-button --list
	npx ${PACKAGE_NAME} snippet ui-button default
`);
}

/**
 * Prints the list of components with snippet examples.
 *
 * @param  {object[]}  components
 *     Component metadata records.
 */
function printSnippetComponents(components) {
	const rows = getSnippetComponentRows(components);
	const width = Math.max(...rows.map((row) => row.name.length));

	console.log(`\n${c.bold("Available snippet components")}\n`);

	for (const row of rows) {
		const exampleText = row.examples === 1 ? "1 example" : `${row.examples} examples`;

		console.log(`  ${c.cyan(row.name.padEnd(width))}  ${row.summary} ${c.dim(`(${exampleText})`)}`);
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
function printSnippetExamples(component) {
	const rows = getSnippetExampleRows(component);
	const width = Math.max(...rows.map((row) => row.name.length));

	console.log(`\n${c.bold(`Snippet examples for ${component.name}`)}\n`);

	for (const row of rows) {
		console.log(`  ${c.cyan(row.name.padEnd(width))}  ${row.summary}`);
	}

	console.log(`
${c.bold("Usage")}

	npx ${PACKAGE_NAME} snippet ${component.name} <example>
`);
}

/**
 * Validates that all names are known sheets. Exits with an error if any are not.
 *
 * @param  {string[]}  names
 *     Names to validate.
 * @param  {string[]}  sheets
 *     All available sheet names.
 */
function validateNames(names, sheets) {
	const invalid = names.filter((name) => !sheets.includes(name));

	if (!invalid.length) {
		return;
	}

	console.error(`Unknown sheet(s): ${invalid.join(", ")}`);
	console.error(`Available: ${sheets.join(", ")}`);
	process.exit(1);
}

/**
 * Prompts the user for a yes/no answer. Returns the raw input string.
 *
 * @param   {string}  question
 *     The question to display.
 * @returns {Promise<string>}
 */
function prompt(question) {
	const rl = createInterface({ input: process.stdin, output: process.stdout });

	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			rl.close();
			resolve(answer);
		});
	});
}

/**
 * Copies one or more stylesheets into the user's project, stamping each with a
 * provenance header. Prompts before overwriting in interactive sessions; exits
 * with an error in non-interactive ones unless --force is set.
 *
 * @param  {string[]}  rawArgs
 *     Arguments following the `copy` subcommand.
 */
async function runCopy(rawArgs) {
	const { flags, names: argNames } = parseArgs(rawArgs);
	const sheets = getSheets();
	const names = flags.all ? sheets : argNames;

	if (!names.length) {
		printList(sheets);

		return;
	}

	validateNames(names, sheets);

	const destDir = join(process.cwd(), flags.dest);

	if (!existsSync(destDir)) {
		mkdirSync(destDir, { recursive: true });
	}

	for (const name of names) {
		const filename = `${name}.css`;
		const destPath = join(destDir, filename);
		const srcPath = join(CSS_DIR, filename);

		if (existsSync(destPath) && !flags.force) {
			if (!process.stdin.isTTY) {
				console.error(
					`${flags.dest}/${filename} already exists. Re-run with --force to overwrite.`,
				);
				process.exit(1);
			}

			const answer = await prompt(`Overwrite ${flags.dest}/${filename}? [y/N] `);

			if (answer.toLowerCase() !== "y") {
				console.log(`  ${c.yellow("Skipped")} ${filename}`);
				continue;
			}
		}

		const source = readFileSync(srcPath, "utf8");

		writeFileSync(destPath, provenanceHeader(filename) + source);
		console.log(`  ${c.green("Copied")} ${filename} → ${flags.dest}/${filename}`);
	}
}

/**
 * Compares one or more local stylesheet copies against the installed pristine
 * versions. Exits with a non-zero code if any differ.
 *
 * @param  {string[]}  rawArgs
 *     Arguments following the `diff` subcommand.
 */
function runDiff(rawArgs) {
	const { flags, names: argNames } = parseArgs(rawArgs);
	const sheets = getSheets();
	const names = flags.all ? sheets : argNames;

	if (!names.length) {
		console.error(`Usage: npx ${PACKAGE_NAME} diff <name...> [--all] [--dest ${DEFAULT_DEST}]\n`);
		process.exit(1);
	}

	validateNames(names, sheets);

	const destDir = join(process.cwd(), flags.dest);

	// Track whether any sheets differ so the exit code reflects the result.
	let allClean = true;

	for (const name of names) {
		const filename = `${name}.css`;
		const destPath = join(destDir, filename);
		const srcPath = join(CSS_DIR, filename);

		if (!existsSync(destPath)) {
			console.log(`  ${c.yellow(filename)}: not found at ${flags.dest}/${filename}`);
			continue;
		}

		const pristine = readFileSync(srcPath, "utf8");
		const local = stripProvenance(readFileSync(destPath, "utf8"));

		if (pristine === local) {
			console.log(`  ${c.green(filename)}: up to date`);
			continue;
		}

		allClean = false;

		const tmpDir = mkdtempSync(join(tmpdir(), "components-diff-"));

		try {
			const pristineFile = join(tmpDir, "pristine.css");
			const localFile = join(tmpDir, "local.css");

			writeFileSync(pristineFile, pristine);
			writeFileSync(localFile, local);

			const result = spawnSync(
				"diff",
				[
					"-u",
					"-L",
					`${filename} (installed ${VERSION})`,
					"-L",
					`${filename} (local)`,
					pristineFile,
					localFile,
				],
				{ stdio: "inherit" },
			);

			if (result.error?.code === "ENOENT") {
				console.log(
					`  ${c.yellow(filename)}: differs from installed version (install diff to see changes)`,
				);
			}
		} finally {
			rmSync(tmpDir, { recursive: true });
		}
	}

	if (!allClean) {
		process.exit(1);
	}
}

/**
 * Discovers or generates component snippets. With --list, prints available
 * components or examples. With a component and example name, prints the
 * generated template code.
 *
 * @param  {string[]}  rawArgs
 *     Arguments following the `snippet` subcommand.
 */
function runSnippet(rawArgs) {
	const { example, flags, name } = parseSnippetArgs(rawArgs);

	if (flags.list && name === null) {
		printSnippetComponents(componentMetadata);

		return;
	}

	if (flags.list) {
		printSnippetExamples(lookupComponent(name));

		return;
	}

	if (name !== null && example !== null) {
		console.log(generateSnippet(lookupComponent(name), example));

		return;
	}

	if (name !== null) {
		printSnippetExamples(lookupComponent(name));

		return;
	}

	console.error(`Usage: npx ${PACKAGE_NAME} snippet [component] [example]\n`);
	process.exit(1);
}

export {
	buildSnippetAttributes,
	generateSnippet,
	getSnippetComponentRows,
	getSnippetExampleRows,
	parseArgs,
	parseSnippetArgs,
	provenanceHeader,
	stripProvenance,
};

// Only run when executed directly, not when imported for testing.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const [, , command, ...rest] = process.argv;

	if (command === "copy") {
		await runCopy(rest);
	} else if (command === "diff") {
		runDiff(rest);
	} else if (command === "snippet") {
		runSnippet(rest);
	} else {
		printList(getSheets());
	}
}
