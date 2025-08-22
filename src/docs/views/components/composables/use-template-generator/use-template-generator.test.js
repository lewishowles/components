import { describe, expect, test, vi, beforeEach } from "vitest";
import { ref } from "vue";
import useTemplateGenerator from "./use-template-generator";

// Mock useTranslationMode
let useTranslationValue = ref(false);
let translationPathPrefixValue = ref("");

vi.mock("@/docs/composables/use-translation-mode/use-translation-mode", () => ({
	default: () => ({
		useTranslation: useTranslationValue,
		translationPathPrefix: translationPathPrefixValue,
	}),
}));

describe("useTemplateGenerator", () => {
	beforeEach(() => {
		useTranslationValue.value = false;
		translationPathPrefixValue.value = "";
	});

	test("should initialise", () => {
		const response = useTemplateGenerator();

		expect(response).toBeTypeOf("object");
	});

	test("should generate a template with only the component's tag", () => {
		const template = useTemplateGenerator("my-component");

		expect(template.value).toBe("<my-component />");
	});

	describe("additionalContent", () => {
		test("should include `additionalContent` as a string", () => {
			const template = useTemplateGenerator("foo-bar", { additionalContent: "Hello world" });

			expect(template.value).toContain("Hello world");
		});

		test("should include `additionalContent` as an array", () => {
			const template = useTemplateGenerator("foo-bar", { additionalContent: ["A", "B"] });

			expect(template.value).toContain("A");
			expect(template.value).toContain("B");
		});

		test("should handle empty additionalContent", () => {
			const template = useTemplateGenerator("foo-bar", { additionalContent: "" });

			expect(template.value).toBe("<foo-bar />");
		});
	});

	test("should generate a template with props", () => {
		const props = ref({
			propA: { value: "foo", type: "string" },
			propB: { value: true, type: "boolean" },
			propC: { value: "bar", type: "select" },
		});

		const template = useTemplateGenerator("foo-bar", { props });

		expect(template.value).toContain("v-bind=\"{ propA: 'foo', propB: true, propC }\"");
	});

	test("should generate a template with slots", () => {
		const slots = ref({
			label: { value: "Label content" },
			footer: { value: "Footer content" },
		});

		const template = useTemplateGenerator("foo-bar", { slots });

		expect(template.value).toContain("<template #label>");
		expect(template.value).toContain("Label content");
		expect(template.value).toContain("<template #footer>");
		expect(template.value).toContain("Footer content");
	});

	test("should generate a template with a default slot", () => {
		const slots = ref({
			default: { value: "Default content" },
		});

		const template = useTemplateGenerator("foo-bar", { slots });

		expect(template.value).toContain("Default content");
	});

	test("should not include a <template #default> in the template", () => {
		const slots = ref({
			default: { value: "Default slot content" },
			other: { value: "Other slot content" },
		});

		const template = useTemplateGenerator("foo-bar", { slots });

		expect(template.value).not.toContain("<template #default>");
		expect(template.value).toContain("Default slot content");
	});

	test("should generate a template with translation mode", () => {
		useTranslationValue.value = true;
		translationPathPrefixValue.value = "prefix";

		const slots = ref({
			label: { value: "Label content" },
			footer: { value: "Footer content" },
		});

		const template = useTemplateGenerator("foo-bar", { slots });

		expect(template.value).toContain("{{ t(\"prefix.label\") }}");
		expect(template.value).toContain("{{ t(\"prefix.footer\") }}");
	});

	test("should return an empty template when missing slots/props", () => {
		const template = useTemplateGenerator("foo-bar", { slots: ref(null), props: ref(null) });

		expect(template.value).toBe(`<foo-bar>

</foo-bar>`);
	});

	test("should generate a template with events", () => {
		const events = ref({
			click: { value: "handleClick()" },
			input: { value: "handleInput($event)" },
		});

		const template = useTemplateGenerator("foo-bar", { events });

		expect(template.value).toContain("@click=\"handleClick()\"");
		expect(template.value).toContain("@input=\"handleInput($event)\"");
	});

	test("should not include events if empty", () => {
		const events = ref({});
		const template = useTemplateGenerator("foo-bar", { events });

		expect(template.value).not.toContain("@");
	});

	test("should indent the output by the given number of tabs", () => {
		const slots = ref({ default: { value: "Indented content" } });
		const template = useTemplateGenerator("foo-bar", { slots, indent: 2 });
		const lines = template.value.split("\n");

		lines.forEach(line => {
			if (line.trim()) expect(line.startsWith("\t\t")).toBe(true);
		});
	});

	test("should render inline props with quotes", () => {
		const props = ref({
			foo: { value: "bar", type: "string", isInline: true },
		});

		const template = useTemplateGenerator("foo-bar", { props });

		expect(template.value).toContain("foo=\"bar\"");
	});

	test("should render variable props without value", () => {
		const props = ref({
			foo: { value: "bar", type: "string", isVariable: true },
		});

		const template = useTemplateGenerator("foo-bar", { props });

		expect(template.value).toContain("v-bind=\"{ foo }\"");
	});

	test("should render variable props with a variable name if provided", () => {
		const props = ref({
			foo: {
				value: "bar",
				type: "string",
				isVariable: true,
				variableName: "fooVariable",
			},
		});

		const template = useTemplateGenerator("foo-bar", { props });

		expect(template.value).toContain("v-bind=\"{ foo: fooVariable }\"");
	});

	test("should handle null slots and props", () => {
		const template = useTemplateGenerator("foo-bar", { slots: null, props: null });

		expect(template.value).toMatch(/<foo-bar[\s\S]*\/>/);
	});

	test("should handle empty string as slot content", () => {
		const slots = ref({ label: { value: "" } });
		const template = useTemplateGenerator("foo-bar", { slots });

		expect(template.value).not.toContain("<template #label>");
	});

	test("should handle empty array as additionalContent", () => {
		const template = useTemplateGenerator("foo-bar", { additionalContent: [] });

		expect(template.value).toBe("<foo-bar />");
	});
});
