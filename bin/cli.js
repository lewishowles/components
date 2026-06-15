#!/usr/bin/env node

import { PACKAGE_NAME } from "../src/cli/utils/constants.js";
import { getHelpSections } from "../src/cli/registry.js";
import { printHelp } from "../src/cli/help.js";
import { runCopy } from "../src/cli/stylesheets/copy.js";
import { runDiff } from "../src/cli/stylesheets/diff.js";
import { getHelpSection as getStylesheetsHelpSection } from "../src/cli/stylesheets/index.js";
import { runPattern } from "../src/cli/components/pattern.js";
import { runSnippet } from "../src/cli/components/snippet.js";

const [, , command, ...rest] = process.argv;

if (command === "stylesheet") {
	const [subcommand, ...subArgs] = rest;

	if (subcommand === "copy") {
		await runCopy(subArgs);
	} else if (subcommand === "diff") {
		runDiff(subArgs);
	} else if (subcommand === "--help" || subcommand === "-h") {
		printHelp([getStylesheetsHelpSection()]);
	} else {
		console.error(`Usage: npx ${PACKAGE_NAME} stylesheet <copy|diff> [options]\n`);
		process.exit(1);
	}
} else if (command === "pattern") {
	await runPattern(rest);
} else if (command === "snippet") {
	await runSnippet(rest);
} else {
	printHelp(getHelpSections());
}
