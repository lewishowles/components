import { describe, expect, test } from "vite-plus/test";
import { _test, buildTemplateAttributes } from "./index.js";

const { getComponentItems, getExampleItems } = _test;

describe("getComponentItems", () => {
	test("Returns sorted component items", () => {
		const items = getComponentItems([
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

		expect(items).toEqual([
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

	test("Excludes components with no examples", () => {
		const items = getComponentItems([
			{
				name: "stub-component",
				summary: "API-only stub.",
				examples: [],
			},
			{
				name: "snippet-component",
				summary: "Has examples.",
				examples: [{ name: "default" }],
			},
		]);

		expect(items).toHaveLength(1);
		expect(items[0].name).toBe("snippet-component");
	});
});

describe("getExampleItems", () => {
	test("Returns example items for a component", () => {
		const items = getExampleItems({
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

		expect(items).toEqual([
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

describe("buildTemplateAttributes", () => {
	test("Returns an empty array for an empty snippet", () => {
		expect(buildTemplateAttributes({})).toEqual([]);
	});

	test("Renders an inline prop as a plain string attribute", () => {
		const attrs = buildTemplateAttributes({
			props: { class: { value: "button--primary", isInline: true } },
		});

		expect(attrs).toEqual(['class="button--primary"']);
	});

	test("Renders a variable prop as a v-bind attribute", () => {
		const attrs = buildTemplateAttributes({
			props: { pressed: { value: "isMuted", isVariable: true } },
		});

		expect(attrs).toEqual([':pressed="isMuted"']);
	});

	test("Renders a boolean true prop as a bare attribute", () => {
		const attrs = buildTemplateAttributes({
			props: { reactive: { value: true, type: "boolean" } },
		});

		expect(attrs).toEqual(["reactive"]);
	});

	test("Renders a boolean false prop as a bound false attribute", () => {
		const attrs = buildTemplateAttributes({
			props: { disabled: { value: false, type: "boolean" } },
		});

		expect(attrs).toEqual([':disabled="false"']);
	});

	test("Renders an undecorated prop as a bound expression", () => {
		const attrs = buildTemplateAttributes({
			props: { href: { value: "/home" } },
		});

		expect(attrs).toEqual([':href="/home"']);
	});

	test("Converts camelCase prop names to kebab-case", () => {
		const attrs = buildTemplateAttributes({
			props: { iconOnly: { value: true, type: "boolean" } },
		});

		expect(attrs).toEqual(["icon-only"]);
	});

	test("Renders an event as an @event attribute", () => {
		const attrs = buildTemplateAttributes({
			events: { click: { value: "handleClick" } },
		});

		expect(attrs).toEqual(['@click="handleClick"']);
	});

	test("Orders props before events", () => {
		const attrs = buildTemplateAttributes({
			props: { class: { value: "btn", isInline: true } },
			events: { click: { value: "handleClick" } },
		});

		expect(attrs).toEqual(['class="btn"', '@click="handleClick"']);
	});
});
