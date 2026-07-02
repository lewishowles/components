import { describe, expect, test, vi } from "vite-plus/test";
import { printHelp } from "./help.js";

// Build a fake cli-style instance, capturing every printed line.
function createUi(options = {}) {
	return {
		options: { colour: false, unicode: true, width: 80, ...options },
		print: vi.fn(),
	};
}

function printedLines(ui) {
	return ui.print.mock.calls.map(([line]) => line).join("\n");
}

describe("printHelp", () => {
	test("prints the usage line and each command", () => {
		const ui = createUi();

		const sections = [
			{
				commands: [
					{ description: "Show component info", name: "info" },
					{ description: "List components", name: "list" },
				],
				group: "Components",
			},
		];

		printHelp(sections, ui);

		const output = printedLines(ui);

		expect(output).toContain("Usage:");
		expect(output).toContain("Components");
		expect(output).toContain("info");
		expect(output).toContain("Show component info");
		expect(output).toContain("list");
		expect(output).toContain("List components");
	});

	test("prints a section footer when present", () => {
		const ui = createUi();

		const sections = [
			{
				commands: [{ description: "Copy files", name: "copy" }],
				footer: "See docs for details",
				group: "Stylesheets",
			},
		];

		printHelp(sections, ui);

		expect(printedLines(ui)).toContain("See docs for details");
	});

	test("does not apply ANSI codes when colour is false", () => {
		const ui = createUi({ colour: false });

		const sections = [
			{ commands: [{ description: "Show info", name: "info" }], group: "Components" },
		];

		printHelp(sections, ui);

		expect(printedLines(ui)).not.toMatch(/\[/);
	});

	test("applies ANSI codes when colour is true", () => {
		const ui = createUi({ colour: true });

		const sections = [
			{ commands: [{ description: "Show info", name: "info" }], group: "Components" },
		];

		printHelp(sections, ui);

		expect(printedLines(ui)).toMatch(/\[/);
	});
});
