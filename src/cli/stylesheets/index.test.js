import { describe, expect, test } from "vite-plus/test";
import { buildCopiedFileHeader, parseSheetArguments, stripCopiedFileHeader } from "./index.js";

describe("parseSheetArguments", () => {
	describe("Defaults", () => {
		test("Returns empty names and default flags when no args are given", () => {
			const { flags, names } = parseSheetArguments([]);

			expect(names).toEqual([]);
			expect(flags.all).toBe(false);
			expect(flags.force).toBe(false);
			expect(flags.help).toBe(false);
			expect(flags.dest).toBe("src/assets/css");
		});
	});

	describe("Names", () => {
		test("Collects sheet names", () => {
			const { names } = parseSheetArguments(["buttons", "theme"]);

			expect(names).toEqual(["buttons", "theme"]);
		});

		test("Strips .css extension from names", () => {
			const { names } = parseSheetArguments(["buttons.css", "theme.css"]);

			expect(names).toEqual(["buttons", "theme"]);
		});

		test("Handles mixed names with and without extension", () => {
			const { names } = parseSheetArguments(["buttons.css", "theme"]);

			expect(names).toEqual(["buttons", "theme"]);
		});
	});

	describe("Flags", () => {
		test("Sets all flag with --all", () => {
			const { flags } = parseSheetArguments(["--all"]);

			expect(flags.all).toBe(true);
		});

		test("Sets force flag with --force", () => {
			const { flags } = parseSheetArguments(["--force"]);

			expect(flags.force).toBe(true);
		});

		test("Sets force flag with -f shorthand", () => {
			const { flags } = parseSheetArguments(["-f"]);

			expect(flags.force).toBe(true);
		});

		test("Sets help flag with --help", () => {
			const { flags } = parseSheetArguments(["--help"]);

			expect(flags.help).toBe(true);
		});

		test("Sets help flag with -h shorthand", () => {
			const { flags } = parseSheetArguments(["-h"]);

			expect(flags.help).toBe(true);
		});

		test("Sets dest with --dest", () => {
			const { flags } = parseSheetArguments(["--dest", "custom/path"]);

			expect(flags.dest).toBe("custom/path");
		});

		test("Sets dest with -d shorthand", () => {
			const { flags } = parseSheetArguments(["-d", "custom/path"]);

			expect(flags.dest).toBe("custom/path");
		});

		test("Ignores --dest when no value follows", () => {
			const { flags } = parseSheetArguments(["--dest"]);

			expect(flags.dest).toBe("src/assets/css");
		});
	});

	describe("Mixed args", () => {
		test("Collects names alongside flags", () => {
			const { flags, names } = parseSheetArguments([
				"buttons",
				"--force",
				"theme",
				"--dest",
				"assets",
			]);

			expect(names).toEqual(["buttons", "theme"]);
			expect(flags.force).toBe(true);
			expect(flags.dest).toBe("assets");
		});
	});
});

describe("buildCopiedFileHeader", () => {
	test("Includes the filename", () => {
		const header = buildCopiedFileHeader("buttons.css");

		expect(header).toContain("buttons.css");
	});

	test("Includes the sheet name in the diff command", () => {
		const header = buildCopiedFileHeader("buttons.css");

		expect(header).toContain("stylesheet diff buttons");
	});

	test("Includes the package name and version", () => {
		const header = buildCopiedFileHeader("buttons.css");

		expect(header).toMatch(/@lewishowles\/components@\d+\.\d+\.\d+/);
	});

	test("Is a valid CSS comment", () => {
		const header = buildCopiedFileHeader("buttons.css");

		expect(header.trimEnd()).toMatch(/^\/\*.*\*\/$/);
	});

	test("Ends with a newline", () => {
		const header = buildCopiedFileHeader("buttons.css");

		expect(header.endsWith("\n")).toBe(true);
	});
});

describe("stripCopiedFileHeader", () => {
	test("Strips a copied-file note from the content", () => {
		const css = ".button { color: red; }\n";
		const header = buildCopiedFileHeader("buttons.css");

		expect(stripCopiedFileHeader(header + css)).toBe(css);
	});

	test("Passes through content with no header unchanged", () => {
		const css = ".button { color: red; }\n";

		expect(stripCopiedFileHeader(css)).toBe(css);
	});

	test("Strips only the first line when it matches the pattern", () => {
		const css =
			"/* Copied from @lewishowles/components@1.0.0 — buttons.css. Compare: npx @lewishowles/components diff buttons */\n.button { color: red; }\n";

		expect(stripCopiedFileHeader(css)).toBe(".button { color: red; }\n");
	});

	test("Does not strip a comment that does not match the pattern", () => {
		const css = "/* My own comment */\n.button { color: red; }\n";

		expect(stripCopiedFileHeader(css)).toBe(css);
	});

	test("Stripping a copied-file note recovers the original", () => {
		const original = ".button { color: red; }\n";
		const copied = buildCopiedFileHeader("buttons.css") + original;

		expect(stripCopiedFileHeader(copied)).toBe(original);
	});
});
