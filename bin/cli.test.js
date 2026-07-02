import { describe, expect, test } from "vite-plus/test";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const cliPath = join(process.cwd(), "bin/cli.js");

// Runs the real CLI as a subprocess. Unit tests on individual command files
// only prove a command behaves correctly when given a `ui` instance — they
// can't catch the entrypoint itself forgetting to pass one through.
function runCli(args) {
	return execFileSync("node", [cliPath, ...args], { encoding: "utf8" });
}

describe("bin/cli.js", () => {
	test("prints top-level help without a command", () => {
		expect(runCli([])).toContain("Usage:");
	});

	test("prints help for stylesheet copy", () => {
		expect(runCli(["stylesheet", "copy", "--help"])).toContain("Usage:");
	});

	test("prints help for stylesheet diff", () => {
		expect(runCli(["stylesheet", "diff", "--help"])).toContain("Usage:");
	});

	test("prints help for the stylesheet group itself", () => {
		expect(runCli(["stylesheet", "--help"])).toContain("Usage:");
	});

	test("prints info for a real component", () => {
		expect(runCli(["info", "ui-button"])).toContain("ui-button");
	});

	test("prints info's fallback listing when no component name is given", () => {
		expect(runCli(["info"])).toContain("Available components");
	});

	test("prints the full component list", () => {
		expect(runCli(["list"])).toContain("Available components");
	});
});
