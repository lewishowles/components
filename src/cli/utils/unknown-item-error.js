import { errorBlock } from "@lewishowles/cli-style";

/**
 * Prints a boxed "Unknown X" error banner. Does not exit or list what was
 * available — the caller follows this with whatever `--list`/`--help`
 * rendering it already has (e.g. `printAllComponents`, `printPatterns`,
 * `printExamples`), so the "not found" case reuses the same labelled,
 * grouped output a user would get by asking for it directly, then exits.
 * Shared by lookupComponent, lookupPattern, and generateSnippet's
 * unknown-example path.
 *
 * @param  {string}  kind
 *     What was not found, e.g. "component", "pattern", "example".
 * @param  {string}  name
 *     The name that was not found.
 * @param  {object}  ui
 *     A cli-style instance from createCliStyle().
 */
export function printUnknownItemError(kind, name, ui) {
	const banner = errorBlock(`Unknown ${kind}: ${name}`, [], {
		...ui.options,
		panelWidth: ui.options.width,
	});

	ui.print(`\n${banner}`);
}
