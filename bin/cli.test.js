import { describe, expect, test } from "vite-plus/test";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const cliPath = join(process.cwd(), "bin/cli.js");

// Runs the real CLI as a subprocess. Unit tests on individual command files
// only prove a command behaves correctly when given a `ui` instance; they
// can't catch the entrypoint itself forgetting to pass one through.
function runCli(args) {
	return execFileSync("node", [cliPath, ...args], { encoding: "utf8" });
}

// Runs the CLI expecting a non-zero exit, returning its stdout. Fails loudly
// if the command unexpectedly succeeds, rather than masking it.
function runCliExpectingFailure(args) {
	try {
		runCli(args);
	} catch (error) {
		if (typeof error.status === "number") {
			return error.stdout ?? "";
		}

		throw error;
	}

	throw new Error(`Expected "node bin/cli.js ${args.join(" ")}" to exit non-zero`);
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

	test("reports an unknown component, then the same listing `list` shows, and exits non-zero", () => {
		const output = runCliExpectingFailure(["info", "not-a-real-component"]);

		expect(output).toContain("Unknown component: not-a-real-component");
		expect(output).toContain("Available components");
	});

	test("reports an unknown pattern, then the same listing `pattern --help` shows, and exits non-zero", () => {
		const output = runCliExpectingFailure(["pattern", "not-a-real-pattern"]);

		expect(output).toContain("Unknown pattern: not-a-real-pattern");
		expect(output).toContain("Available patterns");
	});

	test("reports an unknown snippet example, then that component's example list, and exits non-zero", () => {
		const output = runCliExpectingFailure(["snippet", "ui-button", "not-a-real-example"]);

		expect(output).toContain("Unknown example: not-a-real-example");
		expect(output).toContain("Snippet examples for ui-button");
	});

	test("reports an unknown top-level command, then falls through to general help, and exits non-zero", () => {
		const output = runCliExpectingFailure(["frobnicate"]);

		expect(output).toContain("Unknown command: frobnicate");
		expect(output).toContain("Usage:");
	});

	test("prints plain help with no error banner when no command is given", () => {
		const output = runCli([]);

		expect(output).not.toContain("Unknown command");
	});

	test("lists patterns", () => {
		expect(runCli(["pattern", "--help"])).toContain("Available patterns");
	});

	test("lists snippet examples for a real component", () => {
		expect(runCli(["snippet", "ui-button", "--list"])).toContain("Snippet examples for ui-button");
	});
});
