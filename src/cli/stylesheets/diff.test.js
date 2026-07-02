import { describe, expect, test, vi } from "vite-plus/test";
import { runDiff } from "./diff.js";

// Build a fake cli-style instance, capturing every printed line.
function createUi() {
	return {
		options: { colour: false, unicode: true, width: 80 },
		print: vi.fn(),
	};
}

describe("runDiff", () => {
	test("prints help through the provided ui instance instead of crashing", () => {
		const ui = createUi();

		runDiff(["--help"], ui);

		expect(ui.print).toHaveBeenCalled();
	});
});
