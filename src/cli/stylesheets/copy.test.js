import { describe, expect, test, vi } from "vite-plus/test";
import { runCopy } from "./copy.js";

// Build a fake cli-style instance, capturing every printed line.
function createUi() {
	return {
		options: { colour: false, unicode: true, width: 80 },
		print: vi.fn(),
	};
}

describe("runCopy", () => {
	test("prints help through the provided ui instance instead of crashing", async () => {
		const ui = createUi();

		await runCopy(["--help"], ui);

		expect(ui.print).toHaveBeenCalled();
	});

	test("prints help when no sheet names are given", async () => {
		const ui = createUi();

		await runCopy([], ui);

		expect(ui.print).toHaveBeenCalled();
	});
});
