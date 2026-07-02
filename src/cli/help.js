import { divider, hint, row, style } from "@lewishowles/cli-style";
import { PACKAGE_NAME } from "./utils/constants.js";

/**
 * Prints help from each command group's section.
 *
 * @param  {object[]}  sections
 *     The sections to print.
 * @param  {object}  ui
 *     A cli-style instance from createCliStyle(), used to resolve rendering
 *     options and print to stdout.
 */
export function printHelp(sections, ui) {
	const allCommands = sections.flatMap((section) => section.commands);
	const width = Math.max(...allCommands.map((command) => command.name.length));

	ui.print(`\n${style(`Usage: ${PACKAGE_NAME} [command]`, "bold", ui.options)}\n`);

	for (const section of sections) {
		ui.print(divider({ label: section.group, ...ui.options }));

		for (const command of section.commands) {
			ui.print(
				row(command.name, command.description, {
					...ui.options,
					labelColour: "info",
					labelWidth: width,
				}),
			);
		}

		if (section.footer) {
			ui.print(`\n  ${style(section.footer, "dim", ui.options)}`);
		}

		ui.print("");
	}

	ui.print(hint("Run a command with --help for details.", ui.options));
}
