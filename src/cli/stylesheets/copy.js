import { CSS_DIR } from "../utils/constants.js";
import { c } from "../utils/colour.js";
import { createInterface } from "node:readline";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { printHelp } from "../help.js";

import {
	buildCopiedFileHeader,
	getHelpSection,
	getSheets,
	parseSheetArguments,
	validateSheetNames,
} from "./index.js";

/**
 * Copies one or more stylesheets into the user's project, adding a note to
 * each file. Asks before overwriting when the terminal can answer; exits
 * with an error otherwise unless --force is set.
 *
 * @param  {string[]}  rawArgs
 *     Arguments following the `copy` subcommand.
 */
export async function runCopy(rawArgs) {
	const { flags, names: argNames } = parseSheetArguments(rawArgs);
	const sheets = getSheets();
	const names = flags.all ? sheets : argNames;

	if (flags.help || !names.length) {
		printHelp([getHelpSection()]);

		return;
	}

	validateSheetNames(names, sheets);

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

		writeFileSync(destPath, buildCopiedFileHeader(filename) + source);
		console.log(`  ${c.green("Copied")} ${filename} → ${flags.dest}/${filename}`);
	}
}

/**
 * Prompts the user for a yes/no answer. Returns the raw input string.
 *
 * @param   {string}  question
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
