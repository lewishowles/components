import { describe, expect, test } from "vite-plus/test";
import { generateSnippet, parseSnippetArguments } from "./snippet.js";

describe("parseSnippetArguments", () => {
	test("Returns null component, null example, and list false when no args are given", () => {
		const { example, flags, name } = parseSnippetArguments([]);

		expect(name).toBe(null);
		expect(example).toBe(null);
		expect(flags.help).toBe(false);
		expect(flags.list).toBe(false);
	});

	test("Sets list flag with --list", () => {
		const { flags } = parseSnippetArguments(["--list"]);

		expect(flags.list).toBe(true);
	});

	test("Sets list flag with -l shorthand", () => {
		const { flags } = parseSnippetArguments(["-l"]);

		expect(flags.list).toBe(true);
	});

	test("Sets help flag with --help", () => {
		const { flags } = parseSnippetArguments(["--help"]);

		expect(flags.help).toBe(true);
	});

	test("Sets help flag with -h shorthand", () => {
		const { flags } = parseSnippetArguments(["-h"]);

		expect(flags.help).toBe(true);
	});

	test("Collects the component name", () => {
		const { name } = parseSnippetArguments(["ui-button", "--list"]);

		expect(name).toBe("ui-button");
	});

	test("Collects the example name after the component name", () => {
		const { example, name } = parseSnippetArguments(["ui-button", "default", "--list"]);

		expect(name).toBe("ui-button");
		expect(example).toBe("default");
	});

	test("Returns null example when only component name is given", () => {
		const { example } = parseSnippetArguments(["ui-button"]);

		expect(example).toBe(null);
	});
});

describe("generateSnippet", () => {
	const component = {
		name: "test-component",
		examples: [
			{
				name: "with-slot",
				summary: "Example with default slot content.",
				snippet: {
					slots: { default: { value: "Click me" } },
					props: { class: { value: "btn--primary", isInline: true } },
					events: { click: { value: "handleClick" } },
				},
			},
			{
				name: "self-closing",
				summary: "Example with no default slot.",
				snippet: {
					props: { class: { value: "spinner", isInline: true } },
				},
			},
			{
				name: "no-attrs",
				summary: "Example with no attributes.",
				snippet: {
					slots: { default: { value: "Label" } },
				},
			},
		],
	};

	test("Generates a component with slot content, props, and events", () => {
		const output = generateSnippet(component, "with-slot");

		expect(output).toBe(
			'<test-component class="btn--primary" @click="handleClick">\n  Click me\n</test-component>',
		);
	});

	test("Generates a self-closing tag when there is no default slot", () => {
		const output = generateSnippet(component, "self-closing");

		expect(output).toBe('<test-component class="spinner" />');
	});

	test("Generates a tag with no attributes when the snippet has none", () => {
		const output = generateSnippet(component, "no-attrs");

		expect(output).toBe("<test-component>\n  Label\n</test-component>");
	});
});
