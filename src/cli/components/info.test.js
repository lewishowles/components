import { describe, expect, test, vi } from "vite-plus/test";
import { _test, printInfo } from "./info.js";

const { formatProp, formatSlot, parseInfoArguments, pushSection } = _test;

// Build a fake cli-style instance, capturing every printed line.
function createUi(options = {}) {
	return {
		options: { colour: false, unicode: true, width: 80, ...options },
		print: vi.fn(),
	};
}

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
		const { name, type, description } = formatProp(
			{ name: "label", type: "string", default: null, summary: "The button label." },
			createUi(),
		);

		expect(name).toBe("label");
		expect(type).toBe("string");
		expect(description).toContain("The button label.");
	});

	test("Includes default value as a trailing chip when present", () => {
		const { description } = formatProp(
			{ name: "size", type: "string", default: '"medium"', summary: "Button size." },
			createUi(),
		);

		expect(description).toContain("Button size.");
		expect(description).toContain('default: "medium"');
		expect(description.indexOf("Button size.")).toBeLessThan(description.indexOf("default:"));
	});

	test("Omits the default chip when default is null", () => {
		const { description } = formatProp(
			{ name: "icon", type: "string", default: null, summary: "Icon name." },
			createUi(),
		);

		expect(description).not.toContain("default:");
	});
});

describe("formatSlot", () => {
	test("Formats a slot with just a summary", () => {
		const { name, description } = formatSlot(
			{ name: "default", summary: "Main content." },
			createUi(),
		);

		expect(name).toBe("default");
		expect(description).toBe("Main content.");
	});

	test("Appends default value as a trailing chip when present", () => {
		const { description } = formatSlot(
			{ name: "title", summary: "Error summary heading.", default: "There is a problem" },
			createUi(),
		);

		expect(description).toContain("Error summary heading.");
		expect(description).toContain("default: There is a problem");
	});

	test("Omits the default chip when default is null", () => {
		const { description } = formatSlot(
			{ name: "default", summary: "Content.", default: null },
			createUi(),
		);

		expect(description).toBe("Content.");
	});
});

describe("pushSection", () => {
	test("does nothing when there are no rows", () => {
		const lines = ["existing"];

		pushSection(lines, "Props", [], createUi());

		expect(lines).toEqual(["existing"]);
	});

	test("appends a heading and a rendered table when rows are present", () => {
		const lines = [];

		pushSection(lines, "Props", [{ name: "label", description: "The button label." }], createUi());

		const output = lines.join("\n");

		expect(output).toContain("Props");
		expect(output).toContain("label");
		expect(output).toContain("The button label.");
	});
});

describe("printInfo", () => {
	test("prints the component name, category, and summary", () => {
		const ui = createUi();

		printInfo({ name: "ui-button", category: "interaction", summary: "A button.", props: [] }, ui);

		const output = ui.print.mock.calls[0][0];

		expect(output).toContain("ui-button");
		expect(output).toContain("interaction");
		expect(output).toContain("A button.");
	});

	test("prints a table section for each populated group", () => {
		const ui = createUi();

		printInfo(
			{
				name: "ui-button",
				category: "interaction",
				summary: "A button.",
				props: [{ name: "iconStart", type: "string", default: null, summary: "Leading icon." }],
				slots: [{ name: "default", summary: "Button content." }],
			},
			ui,
		);

		const output = ui.print.mock.calls[0][0];

		expect(output).toContain("Props");
		expect(output).toContain("iconStart");
		expect(output).toContain("Slots");
		expect(output).toContain("Button content.");
	});

	test("prints the usage snippet command", () => {
		const ui = createUi();

		printInfo({ name: "ui-button", category: "interaction", summary: "A button.", props: [] }, ui);

		expect(ui.print.mock.calls[0][0]).toContain("snippet ui-button");
	});
});
