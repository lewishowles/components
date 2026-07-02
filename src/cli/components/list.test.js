import { describe, expect, test, vi } from "vite-plus/test";
import { _test, printAllComponents } from "./list.js";

const { groupByCategory } = _test;

// Build a fake cli-style instance, capturing every printed line.
function createUi(options = {}) {
	return {
		options: { colour: false, unicode: true, width: 80, ...options },
		print: vi.fn(),
	};
}

describe("groupByCategory", () => {
	test("Groups components by category", () => {
		const result = groupByCategory([
			{ category: "form", name: "form-input", summary: "A text input." },
			{ category: "interaction", name: "ui-button", summary: "A button." },
			{ category: "form", name: "form-label", summary: "A label." },
		]);

		expect([...result.keys()]).toEqual(["form", "interaction"]);
		expect(result.get("form")).toEqual([
			{ name: "form-input", summary: "A text input." },
			{ name: "form-label", summary: "A label." },
		]);
		expect(result.get("interaction")).toEqual([{ name: "ui-button", summary: "A button." }]);
	});

	test("Sorts categories alphabetically", () => {
		const result = groupByCategory([
			{ category: "navigation", name: "app-tabs", summary: "Tabs." },
			{ category: "form", name: "form-input", summary: "An input." },
			{ category: "content", name: "content-card", summary: "A card." },
		]);

		expect([...result.keys()]).toEqual(["content", "form", "navigation"]);
	});

	test("Sorts components within a category alphabetically by name", () => {
		const result = groupByCategory([
			{ category: "form", name: "form-wrapper", summary: "A wrapper." },
			{ category: "form", name: "form-field", summary: "A field." },
			{ category: "form", name: "form-input", summary: "An input." },
		]);

		const names = result.get("form").map((item) => item.name);

		expect(names).toEqual(["form-field", "form-input", "form-wrapper"]);
	});

	test("Returns an empty Map for an empty components array", () => {
		const result = groupByCategory([]);

		expect(result.size).toBe(0);
	});

	test("Includes only name and summary in each item", () => {
		const result = groupByCategory([
			{ category: "general", name: "app-link", summary: "A link.", examples: [], props: [] },
		]);

		expect(result.get("general")).toEqual([{ name: "app-link", summary: "A link." }]);
	});
});

describe("printAllComponents", () => {
	test("prints each component grouped under its category heading", () => {
		const ui = createUi();

		printAllComponents(
			[
				{ category: "form", name: "form-input", summary: "A text input." },
				{ category: "interaction", name: "ui-button", summary: "A button." },
			],
			ui,
		);

		const output = ui.print.mock.calls[0][0];

		expect(output).toContain("form");
		expect(output).toContain("form-input");
		expect(output).toContain("A text input.");
		expect(output).toContain("interaction");
		expect(output).toContain("ui-button");
		expect(output).toContain("A button.");
	});

	test("prints usage hints for info and snippet", () => {
		const ui = createUi();

		printAllComponents([{ category: "form", name: "form-input", summary: "A text input." }], ui);

		const output = ui.print.mock.calls[0][0];

		expect(output).toContain("info <component>");
		expect(output).toContain("snippet <component>");
	});
});
