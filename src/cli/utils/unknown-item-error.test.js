import { describe, expect, test, vi } from "vite-plus/test";
import { printUnknownItemError } from "./unknown-item-error.js";

// Build a fake cli-style instance, capturing every printed line.
function createUi(options = {}) {
	return {
		options: { colour: false, unicode: true, width: 80, ...options },
		print: vi.fn(),
	};
}

describe("printUnknownItemError", () => {
	test("prints a banner naming the kind and the unknown value", () => {
		const ui = createUi();

		printUnknownItemError("component", "not-a-real-component", ui);

		const output = ui.print.mock.calls.map(([line]) => line).join("\n");

		expect(output).toContain("Unknown component: not-a-real-component");
	});

	test("does not exit or print anything beyond the banner", () => {
		const ui = createUi();
		const exit = vi.spyOn(process, "exit").mockImplementation(() => {});

		printUnknownItemError("pattern", "not-a-real-pattern", ui);

		expect(exit).not.toHaveBeenCalled();

		exit.mockRestore();
	});
});
