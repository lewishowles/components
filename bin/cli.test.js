import { describe, expect, test } from "vite-plus/test";
import {
	buildSnippetAttributes,
	generateSnippet,
	getSnippetComponentRows,
	getSnippetExampleRows,
	parseArgs,
	parseSnippetArgs,
	provenanceHeader,
	stripProvenance,
} from "./cli.js";

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

describe("parseSnippetArgs", () => {
	test("Returns null component, null example, and list false when no args are given", () => {
		const { example, flags, name } = parseSnippetArgs([]);

		expect(name).toBe(null);
		expect(example).toBe(null);
		expect(flags.list).toBe(false);
	});

	test("Sets list flag with --list", () => {
		const { flags } = parseSnippetArgs(["--list"]);

		expect(flags.list).toBe(true);
	});

	test("Sets list flag with -l shorthand", () => {
		const { flags } = parseSnippetArgs(["-l"]);

		expect(flags.list).toBe(true);
	});

	test("Collects the component name", () => {
		const { name } = parseSnippetArgs(["ui-button", "--list"]);

		expect(name).toBe("ui-button");
	});

	test("Collects the example name as the second positional", () => {
		const { example, name } = parseSnippetArgs(["ui-button", "default", "--list"]);

		expect(name).toBe("ui-button");
		expect(example).toBe("default");
	});

	test("Returns null example when only component name is given", () => {
		const { example } = parseSnippetArgs(["ui-button"]);

		expect(example).toBe(null);
	});
});

describe("getSnippetComponentRows", () => {
	test("Returns sorted component rows", () => {
		const rows = getSnippetComponentRows([
			{
				name: "z-component",
				summary: "Last component.",
				examples: [{ name: "default" }],
			},
			{
				name: "a-component",
				summary: "First component.",
				examples: [{ name: "default" }, { name: "icon" }],
			},
		]);

		expect(rows).toEqual([
			{
				examples: 2,
				name: "a-component",
				summary: "First component.",
			},
			{
				examples: 1,
				name: "z-component",
				summary: "Last component.",
			},
		]);
	});
});

describe("getSnippetExampleRows", () => {
	test("Returns example rows for a component", () => {
		const rows = getSnippetExampleRows({
			examples: [
				{
					name: "default",
					summary: "A default example.",
				},
				{
					name: "icon",
					summary: "An icon example.",
				},
			],
		});

		expect(rows).toEqual([
			{
				name: "default",
				summary: "A default example.",
			},
			{
				name: "icon",
				summary: "An icon example.",
			},
		]);
	});
});

describe("buildSnippetAttributes", () => {
	test("Returns an empty array for an empty snippet", () => {
		expect(buildSnippetAttributes({})).toEqual([]);
	});

	test("Renders an inline prop as a plain string attribute", () => {
		const attrs = buildSnippetAttributes({
			props: { class: { value: "button--primary", isInline: true } },
		});

		expect(attrs).toEqual(['class="button--primary"']);
	});

	test("Renders a variable prop as a v-bind attribute", () => {
		const attrs = buildSnippetAttributes({
			props: { pressed: { value: "isMuted", isVariable: true } },
		});

		expect(attrs).toEqual([':pressed="isMuted"']);
	});

	test("Renders a boolean true prop as a bare attribute", () => {
		const attrs = buildSnippetAttributes({
			props: { reactive: { value: true, type: "boolean" } },
		});

		expect(attrs).toEqual(["reactive"]);
	});

	test("Renders a boolean false prop as a bound false attribute", () => {
		const attrs = buildSnippetAttributes({
			props: { disabled: { value: false, type: "boolean" } },
		});

		expect(attrs).toEqual([':disabled="false"']);
	});

	test("Renders an undecorated prop as a bound expression", () => {
		const attrs = buildSnippetAttributes({
			props: { href: { value: "/home" } },
		});

		expect(attrs).toEqual([':href="/home"']);
	});

	test("Converts camelCase prop names to kebab-case", () => {
		const attrs = buildSnippetAttributes({
			props: { iconOnly: { value: true, type: "boolean" } },
		});

		expect(attrs).toEqual(["icon-only"]);
	});

	test("Renders an event as an @event attribute", () => {
		const attrs = buildSnippetAttributes({
			events: { click: { value: "handleClick" } },
		});

		expect(attrs).toEqual(['@click="handleClick"']);
	});

	test("Orders props before events", () => {
		const attrs = buildSnippetAttributes({
			props: { class: { value: "btn", isInline: true } },
			events: { click: { value: "handleClick" } },
		});

		expect(attrs).toEqual(['class="btn"', '@click="handleClick"']);
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
