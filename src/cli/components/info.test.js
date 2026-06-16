import { describe, expect, test } from "vite-plus/test";
import { _test } from "./info.js";

const { formatProp, formatSlot, formatTable, parseInfoArguments } = _test;

describe("parseInfoArguments", () => {
	test("Parses a component name", () => {
		const result = parseInfoArguments(["ui-button"]);

		expect(result.name).toBe("ui-button");
		expect(result.flags.help).toBe(false);
	});

	test("Sets help flag for --help", () => {
		const result = parseInfoArguments(["--help"]);

		expect(result.flags.help).toBe(true);
		expect(result.name).toBeNull();
	});

	test("Sets help flag for -h", () => {
		const result = parseInfoArguments(["-h"]);

		expect(result.flags.help).toBe(true);
	});

	test("Ignores unknown flags", () => {
		const result = parseInfoArguments(["--unknown", "form-input"]);

		expect(result.name).toBe("form-input");
	});

	test("Returns null name for empty arguments", () => {
		const result = parseInfoArguments([]);

		expect(result.name).toBeNull();
	});
});

describe("formatProp", () => {
	test("Formats a prop with type, default, and summary", () => {
		const [name, description] = formatProp({
			name: "label",
			type: "string",
			default: null,
			summary: "The button label.",
		});

		expect(name).toBe("label");
		expect(description).toContain("string");
		expect(description).toContain("The button label.");
	});

	test("Includes default value when present", () => {
		const [, description] = formatProp({
			name: "size",
			type: "string",
			default: '"medium"',
			summary: "Button size.",
		});

		expect(description).toContain('"medium"');
	});

	test("Omits default part when default is null", () => {
		const [, description] = formatProp({
			name: "icon",
			type: "string",
			default: null,
			summary: "Icon name.",
		});

		expect(description).not.toContain("=");
	});
});

describe("formatSlot", () => {
	test("Formats a slot with just a summary", () => {
		const [name, description] = formatSlot({ name: "default", summary: "Main content." });

		expect(name).toBe("default");
		expect(description).toBe("Main content.");
	});

	test("Appends default value when present", () => {
		const [, description] = formatSlot({
			name: "title",
			summary: "Error summary heading.",
			default: "There is a problem",
		});

		expect(description).toContain("Error summary heading.");
		expect(description).toContain("There is a problem");
	});

	test("Omits default part when default is null", () => {
		const [, description] = formatSlot({
			name: "default",
			summary: "Content.",
			default: null,
		});

		expect(description).toBe("Content.");
	});
});

describe("formatTable", () => {
	test("Pads first column to uniform width", () => {
		const rows = formatTable([
			["short", "Description A."],
			["much-longer-name", "Description B."],
		]);

		const shortLine = rows[0];
		const longLine = rows[1];

		expect(shortLine.indexOf("Description A.")).toBe(longLine.indexOf("Description B."));
	});

	test("Indents each row by two spaces", () => {
		const rows = formatTable([["name", "Description."]]);

		expect(rows[0]).toMatch(/^ {2}/);
	});
});
