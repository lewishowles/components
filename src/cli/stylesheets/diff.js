import { resultTypes, status } from "@lewishowles/cli-style";
import { CSS_DIR, DEFAULT_DEST, PACKAGE_NAME, VERSION } from "../utils/constants.js";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { printHelp } from "../help.js";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

import {
	getHelpSection,
	getSheets,
	parseSheetArguments,
	stripCopiedFileHeader,
	validateSheetNames,
} from "./index.js";

/**
 * Compares one or more local stylesheet copies against the installed
 * versions. Exits with a non-zero code if any differ.
 *
 * @param  {string[]}  rawArguments
 *     Arguments following the `diff` subcommand.
 * @param  {object}  ui
 *     A cli-style instance from createCliStyle().
 */
export function runDiff(rawArguments, ui) {
	const { flags, names: argumentNames } = parseSheetArguments(rawArguments);
	const sheets = getSheets();
	const names = flags.all ? sheets : argumentNames;

	if (flags.help) {
		printHelp([getHelpSection()], ui);

		return;
	}

	if (!names.length) {
		console.error(
			`Usage: npx ${PACKAGE_NAME} stylesheet diff <name...> [--all] [--dest ${DEFAULT_DEST}]\n`,
		);
		process.exit(1);
	}

	validateSheetNames(names, sheets, ui);

	const destinationDirectory = join(process.cwd(), flags.dest);

	// Track whether any sheets differ so the exit code reflects the result.
	let areAllClean = true;

	for (const name of names) {
		const filename = `${name}.css`;
		const destinationPath = join(destinationDirectory, filename);
		const sourcePath = join(CSS_DIR, filename);

		if (!existsSync(destinationPath)) {
			ui.print(
				`  ${status(resultTypes.WARNING, `${flags.dest}/${filename}`, {
					...ui.options,
					label: "Not found",
				})}`,
			);
			continue;
		}

		const installed = readFileSync(sourcePath, "utf8");
		const local = stripCopiedFileHeader(readFileSync(destinationPath, "utf8"));

		if (installed === local) {
			ui.print(
				`  ${status(resultTypes.SUCCESS, filename, { ...ui.options, label: "Up to date" })}`,
			);
			continue;
		}

		areAllClean = false;

		const temporaryDirectory = mkdtempSync(join(tmpdir(), "components-diff-"));

		try {
			const installedFile = join(temporaryDirectory, "installed.css");
			const localFile = join(temporaryDirectory, "local.css");

			writeFileSync(installedFile, installed);
			writeFileSync(localFile, local);

			const result = spawnSync(
				"diff",
				[
					"-u",
					"-L",
					`${filename} (installed ${VERSION})`,
					"-L",
					`${filename} (local)`,
					installedFile,
					localFile,
				],
				{ stdio: "inherit" },
			);

			if (result.error?.code === "ENOENT") {
				ui.print(
					`  ${status(resultTypes.WARNING, "install diff to see changes", {
						...ui.options,
						label: `Differs: ${filename}`,
					})}`,
				);
			}
		} finally {
			rmSync(temporaryDirectory, { recursive: true });
		}
	}

	if (!areAllClean) {
		process.exit(1);
	}
}
