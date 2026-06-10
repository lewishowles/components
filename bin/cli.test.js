import { describe, expect, test } from "vite-plus/test";
import { parseArgs, provenanceHeader, stripProvenance } from "./cli.js";

describe("parseArgs", () => {
	describe("Defaults", () => {
		test("Returns empty names and default flags when no args are given", () => {
			const { flags, names } = parseArgs([]);

			expect(names).toEqual([]);
			expect(flags.all).toBe(false);
			expect(flags.force).toBe(false);
			expect(flags.dest).toBe("src/assets/css");
		});
	});

	describe("Names", () => {
		test("Collects positional names", () => {
			const { names } = parseArgs(["buttons", "theme"]);

			expect(names).toEqual(["buttons", "theme"]);
		});

		test("Strips .css extension from names", () => {
			const { names } = parseArgs(["buttons.css", "theme.css"]);

			expect(names).toEqual(["buttons", "theme"]);
		});

		test("Handles mixed names with and without extension", () => {
			const { names } = parseArgs(["buttons.css", "theme"]);

			expect(names).toEqual(["buttons", "theme"]);
		});
	});

	describe("Flags", () => {
		test("Sets all flag with --all", () => {
			const { flags } = parseArgs(["--all"]);

			expect(flags.all).toBe(true);
		});

		test("Sets force flag with --force", () => {
			const { flags } = parseArgs(["--force"]);

			expect(flags.force).toBe(true);
		});

		test("Sets force flag with -f shorthand", () => {
			const { flags } = parseArgs(["-f"]);

			expect(flags.force).toBe(true);
		});

		test("Sets dest with --dest", () => {
			const { flags } = parseArgs(["--dest", "custom/path"]);

			expect(flags.dest).toBe("custom/path");
		});

		test("Sets dest with -d shorthand", () => {
			const { flags } = parseArgs(["-d", "custom/path"]);

			expect(flags.dest).toBe("custom/path");
		});

		test("Ignores --dest when no value follows", () => {
			const { flags } = parseArgs(["--dest"]);

			expect(flags.dest).toBe("src/assets/css");
		});
	});

	describe("Mixed args", () => {
		test("Collects names alongside flags", () => {
			const { flags, names } = parseArgs(["buttons", "--force", "theme", "--dest", "assets"]);

			expect(names).toEqual(["buttons", "theme"]);
			expect(flags.force).toBe(true);
			expect(flags.dest).toBe("assets");
		});
	});
});

describe("provenanceHeader", () => {
	test("Includes the filename", () => {
		const header = provenanceHeader("buttons.css");

		expect(header).toContain("buttons.css");
	});

	test("Includes the sheet name in the diff command", () => {
		const header = provenanceHeader("buttons.css");

		expect(header).toContain("diff buttons");
	});

	test("Includes the package name and version", () => {
		const header = provenanceHeader("buttons.css");

		expect(header).toMatch(/@lewishowles\/components@\d+\.\d+\.\d+/);
	});

	test("Is a valid CSS comment", () => {
		const header = provenanceHeader("buttons.css");

		expect(header.trimEnd()).toMatch(/^\/\*.*\*\/$/);
	});

	test("Ends with a newline", () => {
		const header = provenanceHeader("buttons.css");

		expect(header.endsWith("\n")).toBe(true);
	});
});

describe("stripProvenance", () => {
	test("Strips a provenance header from the content", () => {
		const css = ".button { color: red; }\n";
		const header = provenanceHeader("buttons.css");

		expect(stripProvenance(header + css)).toBe(css);
	});

	test("Passes through content with no header unchanged", () => {
		const css = ".button { color: red; }\n";

		expect(stripProvenance(css)).toBe(css);
	});

	test("Strips only the first line when it matches the pattern", () => {
		const css =
			"/* Copied from @lewishowles/components@1.0.0 — buttons.css. Compare: npx @lewishowles/components diff buttons */\n.button { color: red; }\n";

		expect(stripProvenance(css)).toBe(".button { color: red; }\n");
	});

	test("Does not strip a comment that does not match the pattern", () => {
		const css = "/* My own comment */\n.button { color: red; }\n";

		expect(stripProvenance(css)).toBe(css);
	});

	test("Roundtrips: stripping a stamped file recovers the original", () => {
		const original = ".button { color: red; }\n";
		const stamped = provenanceHeader("buttons.css") + original;

		expect(stripProvenance(stamped)).toBe(original);
	});
});
