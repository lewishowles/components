import { describe, expect, test, vi, beforeEach } from "vitest";
import { ref } from "vue";
import useTemplateGenerator from "./use-template-generator";

// Mock useTranslationMode
let useTranslationValue = ref(false);
let translationPathPrefixValue = ref("");

vi.mock("@/composables/use-translation-mode/use-translation-mode", () => ({
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

		expect(template.value).toBe(`<my-component>

</my-component>`);
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

			expect(template.value).toBe(`<foo-bar>

</foo-bar>`);
		});
	});

	test("should generate a template with props", () => {
		const props = ref({
			propA: { value: "foo", type: "string" },
			propB: { value: true, type: "boolean" },
			propC: { value: "bar", type: "select" },
		});

		const template = useTemplateGenerator("foo-bar", { props });

		expect(template.value).toContain("v-bind=\"{ propA: 'foo', propB, propC }\"");
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
});
