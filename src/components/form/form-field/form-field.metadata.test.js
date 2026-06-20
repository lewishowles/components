import { describe, expect, test } from "vite-plus/test";
import { formFieldMetadata } from "./form-field.metadata.js";

// The 10 types supported by form-field.vue fieldTypes map.
const SUPPORTED_TYPES = [
	"text",
	"email",
	"password",
	"textarea",
	"checkbox",
	"checkbox-group",
	"radio-group",
	"form-button-group",
	"select",
	"date",
];

// Option-bearing types that must be listed as supported.
const OPTION_BEARING_TYPES = ["select", "radio-group", "checkbox-group", "form-button-group"];

describe("form-field metadata", () => {
	test("exports a metadata object with the required top-level fields", () => {
		expect(formFieldMetadata).toMatchObject({
			name: "form-field",
			category: "form",
			summary: expect.any(String),
			props: expect.any(Array),
			slots: expect.any(Array),
			examples: expect.any(Array),
		});
	});

	test("every prop has a name and type", () => {
		for (const prop of formFieldMetadata.props) {
			expect(prop).toMatchObject({
				name: expect.any(String),
				type: expect.any(String),
			});
		}
	});

	test("every slot has a name and summary", () => {
		for (const slot of formFieldMetadata.slots) {
			expect(slot).toMatchObject({
				name: expect.any(String),
				summary: expect.any(String),
			});
		}
	});

	describe("type prop", () => {
		test("documents all supported field types", () => {
			const typeProp = formFieldMetadata.props.find((p) => p.name === "type");

			expect(typeProp).toBeDefined();
			expect(typeProp.values).toEqual(expect.arrayContaining(SUPPORTED_TYPES));
			expect(typeProp.values).toHaveLength(SUPPORTED_TYPES.length);
		});

		test("documents all option-bearing types", () => {
			const typeProp = formFieldMetadata.props.find((p) => p.name === "type");

			expect(typeProp).toBeDefined();

			for (const type of OPTION_BEARING_TYPES) {
				expect(typeProp.values).toContain(type);
			}
		});
	});

	describe("options slot", () => {
		test("documents the options slot", () => {
			const optionsSlot = formFieldMetadata.slots.find((s) => s.name === "options");

			expect(optionsSlot).toBeDefined();
		});

		test("options slot summary mentions all option-bearing types", () => {
			const optionsSlot = formFieldMetadata.slots.find((s) => s.name === "options");

			expect(optionsSlot).toBeDefined();

			for (const type of OPTION_BEARING_TYPES) {
				expect(optionsSlot.summary).toContain(type);
			}
		});
	});

	describe("validation examples", () => {
		test("no example uses the deprecated { type: '...' } validation shape", () => {
			for (const example of formFieldMetadata.examples) {
				const validationProp = example.snippet?.props?.validation;

				if (!validationProp) {
					continue;
				}

				// The value is a serialised string; check it does not contain type: '...' objects
				// where type would be a rule name (e.g. type: 'required', type: 'email').
				expect(
					validationProp.value,
					`Example "${example.name}" uses deprecated { type: '...' } validation shape`,
				).not.toMatch(/\{\s*type\s*:/);
			}
		});

		test("every validation example uses the { rule: '...' } shape", () => {
			for (const example of formFieldMetadata.examples) {
				const validationProp = example.snippet?.props?.validation;

				if (!validationProp) {
					continue;
				}

				expect(
					validationProp.value,
					`Example "${example.name}" validation should use { rule: '...' } shape`,
				).toMatch(/\brule\s*:/);
			}
		});
	});
});
