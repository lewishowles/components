import { describe, expect, test } from "vite-plus/test";
import { generatePattern, lookupPattern, parsePatternArguments, _test } from "./pattern.js";
import { patterns } from "./patterns.js";

const { getPatternItems, groupByCategory } = _test;

describe("parsePatternArguments", () => {
	test("Returns null name and both flags false when no args are given", () => {
		const { flags, name } = parsePatternArguments([]);

		expect(name).toBe(null);
		expect(flags.help).toBe(false);
		expect(flags.list).toBe(false);
	});

	test("Sets list flag with --list", () => {
		const { flags } = parsePatternArguments(["--list"]);

		expect(flags.list).toBe(true);
	});

	test("Sets list flag with -l shorthand", () => {
		const { flags } = parsePatternArguments(["-l"]);

		expect(flags.list).toBe(true);
	});

	test("Sets help flag with --help", () => {
		const { flags } = parsePatternArguments(["--help"]);

		expect(flags.help).toBe(true);
	});

	test("Sets help flag with -h shorthand", () => {
		const { flags } = parsePatternArguments(["-h"]);

		expect(flags.help).toBe(true);
	});

	test("Collects the pattern name", () => {
		const { name } = parsePatternArguments(["login-form"]);

		expect(name).toBe("login-form");
	});

	test("Ignores unknown flags", () => {
		const { flags, name } = parsePatternArguments(["--unknown", "login-form"]);

		expect(name).toBe("login-form");
		expect(flags.help).toBe(false);
		expect(flags.list).toBe(false);
	});
});

describe("generatePattern", () => {
	const pattern = {
		name: "test-pattern",
		label: "Test pattern",
		summary: "A test pattern.",
		stability: "illustrative",
		template: '<form-wrapper>\n  <form-field name="name">Name</form-field>\n</form-wrapper>',
	};

	test("Starts with a blank line", () => {
		const output = generatePattern(pattern);

		expect(output.startsWith("\n")).toBe(true);
	});

	test("Includes a stability comment on the second line", () => {
		const output = generatePattern(pattern);
		const secondLine = output.split("\n")[1];

		expect(secondLine).toMatch(/^<!--/);
		expect(secondLine).toContain("[illustrative]");
	});

	test("Includes the template after the stability comment", () => {
		const output = generatePattern(pattern);
		const lines = output.split("\n");

		expect(lines.slice(2).join("\n")).toBe(pattern.template);
	});
});

describe("lookupPattern", () => {
	test("Returns a pattern for a known name", () => {
		const firstName = patterns[0].name;
		const pattern = lookupPattern(firstName);

		expect(pattern.name).toBe(firstName);
	});
});

describe("getPatternItems", () => {
	test("Returns one item per pattern", () => {
		const items = getPatternItems();

		expect(items).toHaveLength(patterns.length);
	});

	test("Items are sorted alphabetically by name", () => {
		const items = getPatternItems();
		const names = items.map((item) => item.name);

		expect(names).toEqual([...names].sort());
	});

	test("Each item has name, category, and summary", () => {
		const items = getPatternItems();

		for (const item of items) {
			expect(item).toHaveProperty("name");
			expect(item).toHaveProperty("category");
			expect(item).toHaveProperty("summary");
		}
	});
});

describe("groupByCategory", () => {
	test("Groups items under their category key", () => {
		const items = [
			{ category: "form", name: "login-form", summary: "A login form." },
			{ category: "form", name: "contact-form", summary: "A contact form." },
			{ category: "display", name: "stat-card", summary: "A stat card." },
		];

		const grouped = groupByCategory(items);

		expect(grouped.form).toHaveLength(2);
		expect(grouped.display).toHaveLength(1);
	});

	test("Preserves insertion order of categories", () => {
		const items = [
			{ category: "form", name: "a", summary: "" },
			{ category: "display", name: "b", summary: "" },
		];

		const grouped = groupByCategory(items);

		expect(Object.keys(grouped)).toEqual(["form", "display"]);
	});
});
