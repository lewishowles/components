import { c } from "./utils/colour.js";
import { PACKAGE_NAME } from "./utils/constants.js";

/**
 * Prints help from each command group's section.
 *
 * @param  {object[]}  sections
 *     The sections to print
 */
export function printHelp(sections) {
	const allCommands = sections.flatMap((section) => section.commands);
	const width = Math.max(...allCommands.map((command) => command.name.length));

	console.log(`\n${c.bold(`Usage: ${PACKAGE_NAME} [command]`)}\n`);

	for (const section of sections) {
		console.log(`${c.bold(`${section.group}:`)}`);

		for (const command of section.commands) {
			console.log(`  ${c.cyan(command.name.padEnd(width))}  ${command.description}`);
		}

		if (section.footer) {
			console.log(`\n  ${c.dim(section.footer)}`);
		}

		console.log();
	}

	console.log(`  ${c.dim("Run a command with --help for details.")}\n`);
}
