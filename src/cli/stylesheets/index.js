import { CSS_DIR, DEFAULT_DEST, PACKAGE_NAME, VERSION } from "../utils/constants.js";
import { existsSync, readdirSync } from "node:fs";

/**
 * Returns the list of available stylesheet names (without extension), sorted
 * alphabetically. Exits early if the CSS directory doesn't exist.
 *
 * @returns  {string[]}
 */
export function getSheets() {
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
 * Builds the note added to the top of every copied file.
 *
 * @param   {string}  filename
 *     The stylesheet filename, e.g. `buttons.css`.
 * @returns {string}
 */
export function buildCopiedFileHeader(filename) {
	const name = filename.replace(".css", "");

	return `/* Copied from ${PACKAGE_NAME}@${VERSION} — ${filename}. Compare: npx ${PACKAGE_NAME} stylesheet diff ${name} */\n`;
}

/**
 * Strips the copied-file note from the top of a CSS string so the remaining
 * content can be compared against the installed version.
 *
 * @param   {string}  content
 *     Raw CSS content, with or without a copied-file note.
 * @returns {string}
 */
export function stripCopiedFileHeader(content) {
	return content.replace(/^\/\* Copied from [^\n]+\*\/\n/, "");
}

/**
 * Parses CLI arguments into named flags and sheet names.
 *
 * @param   {string[]}  argv
 *     Arguments following the subcommand name.
 * @returns {{ names: string[], flags: { all: boolean, dest: string, force: boolean, help: boolean } }}
 */
export function parseSheetArguments(argv) {
	const flags = { all: false, dest: DEFAULT_DEST, force: false, help: false };
	const names = [];

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg === "--all") {
			flags.all = true;
		} else if (arg === "--force" || arg === "-f") {
			flags.force = true;
		} else if (arg === "--help" || arg === "-h") {
			flags.help = true;
		} else if ((arg === "--dest" || arg === "-d") && argv[i + 1]) {
			flags.dest = argv[++i];
		} else if (!arg.startsWith("-")) {
			names.push(arg.replace(/\.css$/, ""));
		}
	}

	return { flags, names };
}

/**
 * Validates that all names are known sheets. Exits with an error if any are not.
 *
 * @param  {string[]}  names
 *     Names to validate.
 * @param  {string[]}  sheets
 *     All available sheet names.
 */
export function validateSheetNames(names, sheets) {
	const invalid = names.filter((name) => !sheets.includes(name));

	if (!invalid.length) {
		return;
	}

	console.error(`Unknown sheet(s): ${invalid.join(", ")}`);
	console.error(`Available: ${sheets.join(", ")}`);
	process.exit(1);
}

/**
 * Returns the help section for the stylesheet commands.
 *
 * @returns {{ footer: string, commands: { description: string, name: string }[], group: string }}
 */
export function getHelpSection() {
	const sheets = getSheets();

	return {
		commands: [
			{ description: "Copy stylesheets into your project", name: "stylesheet copy" },
			{
				description: "Compare local copies against the installed version",
				name: "stylesheet diff",
			},
		],
		footer: `Available: ${sheets.join(", ")}`,
		group: "Stylesheets",
	};
}
