import { describe, expect, test } from "vite-plus/test";
import { cwd } from "node:process";
import { pathToFileURL } from "node:url";
import { formWrapperMetadata } from "../../components/form/form-wrapper/form-wrapper.metadata.js";
import { generateSnippet, parseSnippetArguments, _test } from "./snippet.js";

const { normaliseSourceSnippet, resolveSnippetExample } = _test;

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

describe("normaliseSourceSnippet", () => {
	test("Returns inner content for a template-only SFC", () => {
		const output = normaliseSourceSnippet("<template>\n\t<ui-button>Save</ui-button>\n</template>");

		expect(output).toBe("<ui-button>Save</ui-button>");
	});

	test("Returns the full source for an SFC with script setup", () => {
		const source =
			'<template>\n\t<form-wrapper />\n</template>\n\n<script setup>\nimport { ref } from "vue";\n</script>';

		const output = normaliseSourceSnippet(source);

		expect(output).toBe(source);
	});
});

describe("source-backed snippets", () => {
	test("Generates a snippet from a component-local source file", () => {
		const component = {
			...formWrapperMetadata,
			_sourceBaseUrl: new URL("src/components/form/form-wrapper/", pathToFileURL(`${cwd()}/`)),
		};

		const output = generateSnippet(component, "basic-form");

		expect(output).toContain("\n<template>");
		expect(output).toContain('<form-wrapper v-model="formData" @submit="saveProfile">');
		expect(output).toContain("<template #submit-button-label>");
		expect(output).toContain("<script setup>");
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
			'\n<test-component class="btn--primary" @click="handleClick">\n  Click me\n</test-component>',
		);
	});

	test("Generates a self-closing tag when there is no default slot", () => {
		const output = generateSnippet(component, "self-closing");

		expect(output).toBe('\n<test-component class="spinner" />');
	});

	test("Generates a tag with no attributes when the snippet has none", () => {
		const output = generateSnippet(component, "no-attrs");

		expect(output).toBe("\n<test-component>\n  Label\n</test-component>");
	});
});

describe("resolveSnippetExample", () => {
	test("Returns the example name when the component has one example", () => {
		const example = resolveSnippetExample({
			examples: [{ name: "default" }],
		});

		expect(example).toBe("default");
	});

	test("Returns null when the component has multiple examples", () => {
		const example = resolveSnippetExample({
			examples: [{ name: "default" }, { name: "icon" }],
		});

		expect(example).toBe(null);
	});

	test("Returns null when the component has no examples", () => {
		const example = resolveSnippetExample({
			examples: [],
		});

		expect(example).toBe(null);
	});
});
