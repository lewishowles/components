import { describe, expect, test } from "vite-plus/test";
import { formWrapperMetadata } from "./form-wrapper.metadata.js";

describe("form-wrapper metadata", () => {
	test("exports a metadata object with the required top-level fields", () => {
		expect(formWrapperMetadata).toMatchObject({
			name: "form-wrapper",
			category: "form",
			summary: expect.any(String),
			props: expect.any(Array),
			slots: expect.any(Array),
			events: expect.any(Array),
			examples: expect.any(Array),
		});
	});

	test("every prop has a name, type, and summary", () => {
		for (const prop of formWrapperMetadata.props) {
			expect(prop).toMatchObject({
				name: expect.any(String),
				type: expect.any(String),
				summary: expect.any(String),
			});
		}
	});

	test("every slot has a name and summary", () => {
		for (const slot of formWrapperMetadata.slots) {
			expect(slot).toMatchObject({
				name: expect.any(String),
				summary: expect.any(String),
			});
		}
	});

	test("every event has a name and summary", () => {
		for (const event of formWrapperMetadata.events) {
			expect(event).toMatchObject({
				name: expect.any(String),
				summary: expect.any(String),
			});
		}
	});

	describe("rules prop", () => {
		test("is documented", () => {
			const rulesProp = formWrapperMetadata.props.find((p) => p.name === "rules");

			expect(rulesProp).toBeDefined();
		});

		test("has an object type and empty object default", () => {
			const rulesProp = formWrapperMetadata.props.find((p) => p.name === "rules");

			expect(rulesProp.type).toBe("object");
			expect(rulesProp.default).toBe("{}");
		});

		test("summary mentions field-local rule precedence", () => {
			const rulesProp = formWrapperMetadata.props.find((p) => p.name === "rules");

			expect(rulesProp.summary).toContain("Field-local");
		});
	});
});
