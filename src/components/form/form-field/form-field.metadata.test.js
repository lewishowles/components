import { describe, expect, test } from "vite-plus/test";
import { formFieldMetadata } from "./form-field.metadata.js";

// The 12 types supported by form-field.vue fieldTypes map.
const SUPPORTED_TYPES = [
	"text",
	"email",
	"password",
	"textarea",
	"checkbox",
	"checkbox-group",
	"radio-group",
	"button-group",
	"combo-box",
	"select",
	"date",
	"file",
];

// Option-bearing types that must be listed as supported.
const OPTION_BEARING_TYPES = [
	"select",
	"radio-group",
	"checkbox-group",
	"button-group",
	"combo-box",
];

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

	describe("forwarded slots", () => {
		test("documents the option slot and its scoped values", () => {
			const optionSlot = formFieldMetadata.slots.find((slot) => slot.name === "option");

			expect(optionSlot).toBeDefined();
			expect(optionSlot.summary).toContain(
				"option, selected, id, and name for radio-group, checkbox-group, and button-group",
			);
			expect(optionSlot.summary).toContain(
				"combo-box instead provides option, label, value, highlighted, and selected",
			);
		});

		test("documents combo-box loading, empty, and no-results slots", () => {
			for (const name of ["loading", "empty", "no-results"]) {
				const slot = formFieldMetadata.slots.find((entry) => entry.name === name);

				expect(slot).toBeDefined();
			}
		});

		test("documents the checkbox description slot", () => {
			const descriptionSlot = formFieldMetadata.slots.find((slot) => slot.name === "description");

			expect(descriptionSlot).toBeDefined();
		});

		test("does not document the removed options slot", () => {
			const optionsSlot = formFieldMetadata.slots.find((slot) => slot.name === "options");

			expect(optionsSlot).toBeUndefined();
		});
	});
});
